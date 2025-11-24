function RenderTask(taskText, taskSetting) {
    const container = document.getElementById("text-container");
    container.innerHTML = ""; // 清空旧内容

    // ========== 工具函数 ==========
    const createEl = (tag, text, className) => {
        const el = document.createElement(tag);
        if (text) el.textContent = text;
        if (className) el.className = className;
        return el;
    };

    const renderParagraph = (line) => {
        const p = createEl("p", line);
        container.appendChild(p);
    };

    const renderDialogueLine = (line, index) => {
        const wrapper = document.createElement("div");
        // 偶数 incoming，奇数 outgoing
        const cls = index % 2 === 0 ? "message incoming" : "message outgoing";

        wrapper.className = cls;

        const p = createEl("p", line);
        wrapper.appendChild(p);

        container.appendChild(wrapper);
    };

    // ========== 1. 渲染 Task 标题 ==========
    const h2 = createEl("h2", `Task ${taskText.TaskNumber}`);
    container.appendChild(h2);

    // ========== 2. 判断存在 Reading ==========
    if (taskSetting.hasReading === "1") {
        const hReading = createEl("p", "Reading", "section-title");
        container.appendChild(hReading);

        const reading = taskText.Reading;

        if (taskSetting.readingHasTitle === "1") {
            // 第一行标题居中
            const title = createEl("p", reading[0], "reading-title");
            container.appendChild(title);

            // 其余为正文
            for (let i = 1; i < reading.length; i++) {
                renderParagraph(reading[i]);
            }
        } else {
            reading.forEach(renderParagraph);
        }
    }

    // ========== 3. 判断存在 Listening ==========
    if (taskSetting.hasListening === "1") {
        const hListening = createEl("p", "Listening", "section-title");
        container.appendChild(hListening);

        const listening = taskText.Listening;

        let startIdx = 0;

        if (taskSetting.listeningFirstIsIntro === "1") {
            const intro = createEl("p", listening[0], "intro-line");
            container.appendChild(intro);
            startIdx = 1;
        }

        if (taskSetting.listeningIsDialogue === "1") {
            // 对话（跳过 intro 行）
            for (let i = startIdx; i < listening.length; i++) {
                renderDialogueLine(listening[i], i - startIdx);
            }
        } else {
            // 普通段落
            for (let i = startIdx; i < listening.length; i++) {
                renderParagraph(listening[i]);
            }
        }
    }

    // ========== 4. Texts 部分渲染 ==========
    if (taskSetting.hasTexts === "1") {
        const hTexts = createEl("p", "Texts", "section-title");
        container.appendChild(hTexts);

        const texts = taskText.Texts;
        let startIdx = 0;

        if (taskSetting.textsFirstIsIntro === "1") {
            const intro = createEl("p", texts[0], "intro-line");
            container.appendChild(intro);
            startIdx = 1;
        }

        if (taskSetting.textsIsDialogue === "1") {
            for (let i = startIdx; i < texts.length; i++) {
                renderDialogueLine(texts[i], i - startIdx);
            }
        } else {
            for (let i = startIdx; i < texts.length; i++) {
                renderParagraph(texts[i]);
            }
        }
    }
}

RenderTask(sampleTaskText, sampleSetting);