// 监听翻译表单的提交事件
document.getElementById('translationForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // 阻止表单默认提交行为
    
    // 获取用户输入的文本并去除首尾空格
    const text = document.getElementById('textInput').value.trim();
    if (!text) {
        showError('请输入要翻译的文本'); // 如果文本为空，显示错误提示
        return;
    }
    
    // 检查文本长度是否超过8000字符
    if (text.length > 8000) {
        showError('文本长度不能超过8000字符'); // 如果超过，显示错误提示
        return;
    }
    
    // 显示加载状态，隐藏结果和错误区域
    showLoading(true);
    hideResult();
    hideError();
    
    try {
        // 发起翻译请求
        const response = await fetch('/api/v1/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 设置请求头为JSON格式
            },
            body: JSON.stringify({
                text: text, // 用户输入的文本
                output_format: document.getElementById('wordFormat').checked ? 'word' : 'json', // 输出格式（Word或JSON）
                include_vocabulary: document.getElementById('includeVocabulary').checked // 是否包含词汇表
            })
        });
        
        // 解析响应数据
        const data = await response.json();
        
        if (data.success) {
            showResult(data); // 如果翻译成功，显示结果
        } else {
            showError(data.error || '翻译失败'); // 如果翻译失败，显示错误信息
        }
    } catch (error) {
        showError('网络错误：' + error.message); // 捕获网络错误并显示
    } finally {
        showLoading(false); // 无论成功或失败，隐藏加载状态
    }
});

// 控制加载状态的显示与隐藏
function showLoading(show) {
    const loading = document.getElementById('loading'); // 获取加载元素
    const btn = document.getElementById('translateBtn'); // 获取翻译按钮
    
    if (show) {
        loading.classList.remove('d-none'); // 显示加载动画
        btn.disabled = true; // 禁用翻译按钮
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...'; // 更新按钮文本
    } else {
        loading.classList.add('d-none'); // 隐藏加载动画
        btn.disabled = false; // 启用翻译按钮
        btn.innerHTML = '<i class="fas fa-play"></i> 开始翻译'; // 恢复按钮文本
    }
}

// 显示翻译结果和词汇表
function showResult(data) {
    document.getElementById('translationOutput').textContent = data.translation;
    
    // 显示词汇表
    const vocabSection = document.getElementById('vocabularySection');
    const vocabTable = document.querySelector('#vocabularyTable tbody');
    vocabTable.innerHTML = ''; // 清空词汇表内容
    
    if (data.vocabulary && data.vocabulary.length > 0) {
        // 遍历词汇表数据并添加到表格中
        data.vocabulary.forEach(vocab => {
            const row = vocabTable.insertRow();
            row.innerHTML = `
                <td>${vocab.english}</td>
                <td>${vocab.chinese}</td>
                <td>${vocab.explanation}</td>
            `;
        });
        vocabSection.classList.remove('d-none'); // 显示词汇表区域
    } else {
        vocabSection.classList.add('d-none'); // 隐藏词汇表区域
    }
    
    // 显示下载按钮（如果提供了Word文档链接）
    const downloadSection = document.getElementById('downloadSection');
    if (data.word_document_url) {
        document.getElementById('downloadBtn').href = data.word_document_url;
        downloadSection.classList.remove('d-none'); // 显示下载区域
    } else {
        downloadSection.classList.add('d-none'); // 隐藏下载区域
    }
    
    // 显示结果区域
    document.getElementById('result').classList.remove('d-none');
}

// 隐藏结果区域
function hideResult() {
    document.getElementById('result').classList.add('d-none');
}

// 显示错误信息
function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message; // 设置错误信息内容
    errorElement.classList.remove('d-none'); // 显示错误区域
}

// 隐藏错误区域
function hideError() {
    document.getElementById('error').classList.add('d-none');
}