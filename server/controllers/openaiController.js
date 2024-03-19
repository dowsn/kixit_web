import fs from 'fs';
import OpenAI from 'openai';
import constants from '../config/constants.js';
import https from 'https';
import path from 'path';
import {randomString} from "../helpers/utilities.js";

class OpenAIController {
  constructor() {
    this.openai = new OpenAI();
    this.userPrompt = '';
    this.systemPrompt = '';
    this.model = 'gpt-3.5-turbo';
  }

  async generateImages(prompt, playerId, gameId) {
    const response = await this.openai.images.generate({
      model: 'dall-e-2',
      prompt: prompt,
      n: 3,
      response_format: 'url',
      size: '256x256',
    });

    console.log(response.data);
    let imageUrls = response.data.map((image) => image.url);


    const dir = path.join(process.cwd(), 'server', 'images', gameId, playerId);
    fs.mkdirSync(dir, { recursive: true });

    let i = randomString()
    for (let imageUrl  of imageUrls) {
      i++;
      const filePath = path.join(dir, 'image' + i + '.png');
      const file = fs.createWriteStream(filePath);

      https.get(imageUrl, function(response) {
        response.pipe(file);
        response.on('end', function() {
          console.log('Image downloaded successfully');
        });
      }).on('error', function(error) {
        console.error('Error downloading image: ', error);
      });
    }


    file.on('error', function(error) {
      console.error('Error writing file: ', error);
    });

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
