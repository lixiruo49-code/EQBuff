import { GoogleGenAI } from "@google/genai";

let genAI: any = null;

function getAI() {
  if (!genAI) {
    // 优先检查 Vite 环境变量，这是 Vercel 等平台部署 Vite 项目的标准方式
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("DEBUG: Both import.meta.env.VITE_GEMINI_API_KEY and process.env.GEMINI_API_KEY are missing.");
      throw new Error("Missing GEMINI_API_KEY (Make sure VITE_GEMINI_API_KEY is set in your Vercel Environment Variables and you have REDEPLOYED)");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export async function generateResponse(type: string, data: any) {
  try {
    const ai = getAI();

    let prompt = "";
    if (type === 'answer') {
      prompt = `作为高情商社交助手，请根据以下场景和问题生成1-3条得体的话术。
      场景：${data.scene}
      问题：${data.input}
      展示重点：${data.focus}
      要求：每条50-150字，贴合场景，避免模板化。直接返回话术列表，用分号隔开。`;
    } else if (type === 'liven-up') {
      prompt = `作为高情商社交助手，请根据以下场景生成1-3条氛围感/助兴话术。
      场景：${data.scene}
      类型：${data.style}
      要求：如果是酒桌祝酒词50-100字，话题开启30-80字。语言轻松自然。直接返回话术列表，用分号隔开。`;
    } else if (type === 'hit-back') {
      prompt = `作为高情商社交助手，请针对以下恶意质疑/阴阳怪气内容生成1-3条幽默、不尴尬的回击话术。
      质疑内容：${data.input}
      场景：${data.scene}
      语气：${data.tone}
      要求：30-100字，体面破局，不破坏关系。直接返回话术列表，用分号隔开。`;
    } else if (type === 'destroy') {
      prompt = `作为尖锐回击助手（用于极端场景），请针对以下内容生成一条极其难听但不带脏字的回击。
      内容：${data.input}
      要求：采用对比、讽刺等修辞，目的是怼赢对方。仅返回一条话术。`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: prompt }] }]
    });

    const text = response.text || "";
    return text.split(/[;；\n]/).filter((s: string) => s.trim().length > 0);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function scorePractice(question: string, answer: string) {
  try {
    const ai = getAI();
    
    const prompt = `分析以下情商练习题的回应：
    题目：${question}
    用户回答：${answer}
    
    请提供评分（100分制）、详细点评（优点和不足）、优化建议，并给出2条高情商参考话术。
    还需要对以下6个维度进行0-100评分：
    selfAwareness (自我认知), selfRegulation (自我调节), socialAwareness (社交认知), socialRegulation (社交调节), sceneAdaptation (场景适配), expression (语言表达)。
    
    返回JSON格式：
    {
      "score": number,
      "comment": string,
      "improvement": string,
      "references": string[],
      "dimensions": {
        "selfAwareness": number,
        "selfRegulation": number,
        "socialAwareness": number,
        "socialRegulation": number,
        "sceneAdaptation": number,
        "expression": number
      }
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Gemini Scoring Error:", error);
    throw error;
  }
}

export async function generateQuestion(category: string, difficulty: string) {
  try {
    const ai = getAI();
    
    const prompt = `生成一个模拟高情商社交场景的练习题。
    类别：${category}
    难度：${difficulty}
    
    返回JSON格式：
    {
      "question": "题目内容",
      "reference": ["参考话术1", "参考话术2"]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Gemini Question Generation Error:", error);
    throw error;
  }
}
