# AI Studio Transition Guide

This repository has been optimized for use with **Google AI Studio**. To avoid crashes caused by the large `node_modules` folder, follow these steps:

## 1. Create a Clean Zip
We have provided a script to handle this for you. Open your terminal in the project root and run:

```bash
chmod +x prepare_for_ai.sh
./prepare_for_ai.sh
```

This will create a file named `ai-studio-upload.zip`.

## 2. Upload to AI Studio
1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Start a new chat with **Gemini 1.5 Pro** or **Gemini 1.5 Flash**.
3.  Click the `+` (Add folder/files) button.
4.  Select `ai-studio-upload.zip`.
5.  Gemini will now have access to your entire codebase (Vite config, components, styles, etc.) without being overwhelmed by library internal files.

## 3. Why this works
By excluding `node_modules`, you reduce the file count from ~20,000+ to just your actual source files (~100). This stays within the context window limits and prevents browser memory crashes during upload.
