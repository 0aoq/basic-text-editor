/*

Created 1/7/2021
Uses local file storage API to load files
Also accessable by going to https://c-zero.web.app/js/text-editor/files.js

*/

// Variables

const FileUploadBtn = find("#FileOpen")
const FileSaveBtn = find("#FileSave")
const FileSaveAsBtn = find("#FileSaveAs")
const FileBlank = find("#FileBlank")

const PreTextArea = find("#pretext")
const PostTextArea = find("#posttext")
const SavePrompt = find("#saveprompt")

const OpenedFile = find("#OpenedFile")

var HasSaveFile = true

FileUploadBtn.addEventListener("click", async() => {
    HasSaveFile = true

    display(PreTextArea, false)
    display(PostTextArea, false)
    display(SavePrompt, false)

    OpenedFile.style.display = "inline-block"
    OpenedFile.innerHTML = "Opened: Choosing..."
})

FileBlank.addEventListener("click", () => {
    HasSaveFile = false
    FileSaveBtn.classList.add("disabled")

    display(PreTextArea, false)
    display(PostTextArea)
    display(SavePrompt, false)

    PostTextArea.value = ""
    OpenedFile.innerHTML = ""
    OpenedFile.style.display = "inline-block"
})

const fileOptions = {
    types: [{
        description: 'Text Files',
        accept: {
            'text/plain': ['.txt'],
            // More common text files
            'html/plain': ['.html'],
            'css/plain': ['.css'],
            'js/plain': ['.js'],
            'json/plain': ['.json'],
            'c/plain': ['.c'],
            'json/plain': ['.json'],
            'cc/plain': ['.cc'],
            'cs/plain': ['.cs'],
            'gitignore/plain': ['.gitignore'],
            'cache/plain': ['.cache'],
            // Add other text file types below
            // 'example/plain': ['.example'],
        },
    }, ],
};

// File Btns

let fileHandle
FileUploadBtn.addEventListener('click', async() => {
    [fileHandle] = await window.showOpenFilePicker(fileOptions)
    const file = await fileHandle.getFile()
    const contents = await file.text()
    PostTextArea.value = contents
    FileSaveBtn.classList.remove("disabled")
    OpenedFile.innerHTML = "Opened: " + await file.name
    display(PostTextArea)
    display(SavePrompt, false)
    OpenedFile.style.display = "inline-block"
})

PostTextArea.addEventListener("input", () => {
    display(SavePrompt)
})

FileSaveBtn.addEventListener('click', async() => {
    if (checkSaveFile()) {
        writeFile(fileHandle, PostTextArea.value)
        display(SavePrompt, false)
    }
})

FileSaveAsBtn.addEventListener('click', async() => {
    writeFileAs()
    display(SavePrompt, false)
})

// File Functions

async function writeFile(fileHandle, contents) {
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
}

async function writeFileAs() {
    const handle = await window.showSaveFilePicker(fileOptions);
    writeFile(handle, PostTextArea.value)

    if (!checkSaveFile()) {
        FileSaveBtn.classList.remove("disabled")
        HasSaveFile = true
    }

    fileHandle = handle
    OpenedFile.innerHTML = "Opened: New File"
    return handle;
}

function checkSaveFile() {
    if (HasSaveFile === false) {
        FileSaveBtn.classList.add("disabled")
        HasSaveFile = false

        return false
    } else {
        FileSaveBtn.classList.remove("disabled")
        HasSaveFile = true

        return true
    }
}
