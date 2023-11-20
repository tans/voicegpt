import { HandlerContext } from "$fresh/server.ts";
import { denoPlugins } from "$fresh/src/build/deps.ts";

import OpenAI, { toFile } from "https://deno.land/x/openai@v4.16.1/mod.ts";

const openai = new OpenAI();

export const handler = {
  async POST(request) {
    let blob = await request.blob();
    console.log(blob);
    let db = await Deno.openKv();

    let { value: messages } = await db.get(["demo", "messages"]);
    messages = [
      {
        role: "system",
        content:
          "你叫小赛罗， 赛罗奥特曼是赛文奥特曼的儿子，光之国新一代的年轻奥特战士。请用中文简短的回答问题。",
      },
    ];
    let file = await toFile(await blob.arrayBuffer(), "speech.wav");
    console.log(file);
    const translation = await openai.audio.translations.create({
      file: file,
      model: "whisper-1",
    });

    console.log(translation.text)
    messages.push({
      role: "user",
      content: translation.text,
    });

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      model: "gpt-3.5-turbo",
      messages: messages,
    };
    const completion = await openai.chat.completions.create(params);

    const answer = completion.choices[0]?.message?.content ||
      "听不清，再说一次";
    console.log(answer)
    // messages.push({
    //   role: "assistant",
    //   content: answer,
    // });

    // await db.set(["demo", "messages"], messages);
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: answer,
    });
    return mp3;
  },
};