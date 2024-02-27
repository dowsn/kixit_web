import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';
import constants from '../config/constants.js';

class OpenAIController {
  constructor() {
    this.openai = new OpenAI();
    this.userPrompt = '';
    this.systemPrompt = '';
    this.model = 'gpt-3.5-turbo';
  }

  async generateImages(prompt) {
    const response = await this.openai.images.generate({
      model: 'dall-e-2',
      prompt: prompt,
      n: 1,
      response_format: 'b64_json',
      size: '256x256',
    });

    // let image_url1 = response.data[0].url;
    // let image_url2 = response.data[1].url;
    // let image_url3 = response.data[3].url;

    let image = response.data[0].b64_json;

    let base64Image = image.split(';base64,').pop();

    fs.writeFile(
      path.join(constants.__dirname + '/images', 'image.png'),
      base64Image,
      { encoding: 'base64' },
      (err) => {
        console.error('Error:', err);
      },
    );

    // console.log(image_url);
  }

  setUserPrompt(prompt) {
    this.userPrompt = prompt;
  }

  setSystemPrompt(prompt) {
    this.systemPrompt = prompt;
  }

  setModel(model) {
    this.model = model;
  }

  async simpleChat() {
    const messages = [
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: this.userPrompt },
    ];

    var model = this.model;

    const completion = await this.openai.chat.completions.create({
      messages,
      model,
    });

    return completion.choices[0].message.content;
  }

  async generateExhibitionTitle() {
    this.setSystemPrompt(
      'You are an experienced galerist and you want to open a new exhibition.',
    );
    this.setUserPrompt('Give me an original title for exhibition');

    try {
      var response = await this.simpleChat();
      return response;
    } catch (err) {
      console.error(err);
      throw new Error('Error generating exhibition title');
    }
  }
}

export default new OpenAIController();
