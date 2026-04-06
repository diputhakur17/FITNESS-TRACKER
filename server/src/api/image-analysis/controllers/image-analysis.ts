import { Context } from "koa"
import { analyzeImage } from "../services/gemini";



module.exports = {
  async analyze(ctx: Context) {
    const file = ctx.request.files?.image as any;
    console.log("Received file:", file);
    if (!file) return ctx.badRequest("No image uploaded");

    const filePath = file.filepath;

    if (!filePath) {
      console.error("File object:", file);
      return ctx.badRequest("Invalid file upload");
    }

    try {
      const result = await analyzeImage(filePath);
      return ctx.send({ success: true, result });
    } catch (error) {
      ctx.internalServerError("Analysus failed", { error: error.message });
    }
  },
};