# DataTables 测试

<style>
    #vocabTable td, #vocabTable th {
        text-align: center;
    }
</style>

<table id="vocabTable"></table>

<script>
    fetch('/assets/data/KyleBing-english-vocabulary/1-初中-顺序.json')
        .then(response => response.json())  // 将响应解析为 JSON
        .then(data => {
            // 将数据渲染到 DataTable
            const tableData = data.map(item => [
                item.word,  // 显示单词
                // 处理 translations 数据，确保有内容时显示，否则显示 "无翻译"
                item.translations && item.translations.length > 0
                    ? `${window.Utils.str.getTransPreffix(item.translations[0].translation)}`
                    : '无翻译'
            ]);

            window.Utils.ui.createDataTable(
                'vocabTable',                 // tableId
                ['单词', '中文'],                // columns
                tableData,                       // data
                {
                    pageLength: 15,
                    useURLParam: true
                }
            );
        })
        .catch(error => console.error('Error fetching the JSON file:', error));
</script>