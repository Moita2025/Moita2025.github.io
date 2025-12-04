# DataTables 测试

<style>
    #test td {
        text-align: center;
    }
</style>

<table id="test" class="cell-border compact stripe">
    <thead>
        <tr>
            <th>单词</th>
            <th>中文</th>
        </tr>
    </thead>
    <tbody>
        <!-- 数据将会被填充到这里 -->
    </tbody>
</table>

<script>

    function applyPageFromUrl(table) {
        const page = window.Utils.url.getSearchParam({
            paramName: 'page',
            defaultParam: 0
        });
        if (page !== null && !isNaN(page)) {
            const pageIndex = Math.max(0, parseInt(page, 10) - 1); // 防止负数
            if (table.page.info().pages > pageIndex) {        // 防止超出最大页
                table.page(pageIndex).draw('page');
            }
        }
    }

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

            // 初始化 DataTable，并填充数据
            const table = $('#test').DataTable({
                data: tableData,  // 填充数据
                paging: true,     // 启用分页
                searching: true,  // 启用搜索
                pageLength: 10,    // 默认每页显示5条
                lengthMenu: [5, 10, 15, 20],  // 允许用户选择的条目数
            });

            table.on('draw.dt', function () {
                const info = table.page.info();
                const currentPageIndex = info.page;

                const url = new URL(window.location);
                var paramResult = (currentPageIndex == 0)?(""):(currentPageIndex + 1);
                window.Utils.url.updateSearchParams({page: paramResult});
            });

            applyPageFromUrl(table);
        })
        .catch(error => console.error('Error fetching the JSON file:', error));
</script>