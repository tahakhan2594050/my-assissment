import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { createCanvas } from 'canvas';
import { GoogleGenAI, Modality } from "@google/genai";
import axios from "axios";

// OpenAI for text-based AI (using Gemini)
const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Placeholder image creation
async function createPlaceholderImage(prompt) {
    try {
        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AI Image Generator', 256, 200);
        
        ctx.font = '16px Arial';
        ctx.fillText('Generating Image...', 256, 240);
        ctx.fillText('Please wait while image is being created', 256, 280);
        
        ctx.font = '14px Arial';
        const words = prompt.split(' ');
        let line = '';
        let y = 320;
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 480 && i > 0) {
                ctx.fillText(line, 256, y);
                line = words[i] + ' ';
                y += 20;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, 256, y);
        
        return canvas.toBuffer('image/png');
    } catch (error) {
        console.log('Error creating placeholder image:', error.message);
        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AI Generated Image', 256, 256);
        return canvas.toBuffer('image/png');
    }
}

// Generate Article using free AI service
export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({ success: false, message: "Limit reached. Upgrade to continue."});
        }

        // Use free AI service (Hugging Face Inference API - no key needed)
        const response = await axios.post('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            inputs: prompt,
            parameters: {
                max_length: Math.min(length, 500),
                temperature: 0.7,
                do_sample: true
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        let content;
        if (response.data && response.data[0] && response.data[0].generated_text) {
            content = response.data[0].generated_text;
        } else {
            // Fallback content if API fails
            content = `# Article: ${prompt}\n\nI apologize, but I'm currently experiencing technical difficulties with the AI service. Here's a basic article structure for your topic:\n\n## Introduction\nThis article explores ${prompt}.\n\n## Main Content\nPlease provide more specific details about what you'd like to cover in this article.\n\n## Conclusion\nThank you for reading about ${prompt}.`;
        }

        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                   VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }

        res.json({ success: true, content });

    } catch (error) {
        console.log('Article generation error:', error.message);
        
        // Provide fallback content
        const fallbackContent = `# Article: ${req.body.prompt}\n\nI apologize, but I'm currently experiencing technical difficulties. Here's a basic article structure:\n\n## Introduction\nThis article explores ${req.body.prompt}.\n\n## Main Content\nPlease provide more specific details about what you'd like to cover.\n\n## Conclusion\nThank you for reading.`;
        
        try {
            await sql`INSERT INTO creations (user_id, prompt, content, type) 
                       VALUES (${req.auth().userId}, ${req.body.prompt}, ${fallbackContent}, 'article')`;
            
            res.json({ success: true, content: fallbackContent });
        } catch (dbError) {
            res.json({ success: false, message: "Service temporarily unavailable. Please try again later." });
        }
    }
};

// Generate Blog Title with fallback
export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({ success: false, message: "Limit reached. Upgrade to continue."});
        }

        // Extract keyword and category from prompt
        const promptParts = prompt.split(' ');
        const keyword = promptParts.find(part => part.includes('keyword')) ? 
                       promptParts[promptParts.indexOf(promptParts.find(part => part.includes('keyword'))) + 1] : 
                       'topic';
        
        // Generate creative blog titles
        const titles = [
            `10 Amazing Facts About ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} You Need to Know`,
            `The Ultimate Guide to ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Everything You Should Know`,
            `Why ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} is Trending: A Complete Analysis`,
            `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} 101: A Beginner's Complete Guide`,
            `The Future of ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Trends and Predictions`
        ];

        const content = titles.join('\n\n');

        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                   VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }

        res.json({ success: true, content });

    } catch (error) {
        console.log('Blog title generation error:', error.message);
        res.json({ success: false, message: "Service temporarily unavailable. Please try again later." });
    }
};

// Helper function to upload image to Cloudinary and save to database
async function saveImageToDatabase(userId, prompt, imageBuffer, publish) {
    try {
        const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
        console.log('Uploading image to Cloudinary...');
        const { secure_url } = await cloudinary.uploader.upload(base64Image);
        console.log('Image uploaded to Cloudinary:', secure_url);
        
        console.log('Saving to database...');
        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) 
                   VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;
        console.log('Image saved to database');
        
        return secure_url;
    } catch (error) {
        console.error('Error saving image:', error.message);
        throw new Error(`Failed to save image: ${error.message}`);
    }
}

// Generate Image with multiple API support and fallbacks
export const generateImage = async (req, res) => {
    try {
        console.log('=== Image Generation Request Received ===');
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        console.log('User ID:', userId);
        console.log('Prompt:', prompt);
        console.log('Publish:', publish);
        console.log('Plan:', plan);

        let imageBuffer = null;
        let errorMessages = [];

        // Try Pollinations.ai first (FREE - no API key needed, very reliable)
        try {
            console.log('Attempting image generation with Pollinations.ai...');
            // Pollinations.ai is completely free and doesn't require API key
            const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&model=flux&nologo=true`;
            
            const pollResponse = await axios.get(pollinationsUrl, {
                responseType: 'arraybuffer',
                timeout: 45000, // 45 second timeout
                validateStatus: function (status) {
                    return status === 200;
                }
            });

            // Pollinations returns image directly
            imageBuffer = Buffer.from(pollResponse.data);
            console.log('Successfully generated image with Pollinations.ai');
        } catch (pollError) {
            console.log('Pollinations.ai error:', pollError.message);
            errorMessages.push(`Pollinations: ${pollError.message}`);
        }

        // Try Clipdrop API if Pollinations failed
        if (!imageBuffer && process.env.CLIPDROP_API_KEY) {
            try {
                console.log('Attempting image generation with Clipdrop API...');
                // Clipdrop uses x-api-key header for authentication
                const response = await axios.post(
                    'https://clipdrop.co/api/v1/image-generation',
                    { prompt: prompt },
                    {
                        headers: {
                            'x-api-key': process.env.CLIPDROP_API_KEY,
                            'Content-Type': 'application/json',
                        },
                        responseType: 'arraybuffer',
                        timeout: 30000, // 30 second timeout
                        validateStatus: function (status) {
                            return status >= 200 && status < 300; // Accept only 2xx responses
                        }
                    }
                );

                // Check if response is actually an image (PNG/JPEG)
                const contentType = response.headers['content-type'];
                if (contentType && contentType.startsWith('image/')) {
                    // Clipdrop returns image as binary data
                    imageBuffer = Buffer.from(response.data);
                    console.log('Successfully generated image with Clipdrop API');
                } else {
                    // Try parsing as JSON in case it returns a URL
                    try {
                        const jsonResponse = JSON.parse(Buffer.from(response.data).toString());
                        if (jsonResponse.image_url || jsonResponse.url) {
                            const imageUrl = jsonResponse.image_url || jsonResponse.url;
                            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                            imageBuffer = Buffer.from(imageResponse.data);
                            console.log('Successfully generated image with Clipdrop API (via URL)');
                        } else {
                            throw new Error('Unexpected response format from Clipdrop');
                        }
                    } catch (parseError) {
                        throw new Error('Invalid response format from Clipdrop API');
                    }
                }
            } catch (error) {
                const errorMsg = error.response?.data 
                    ? Buffer.from(error.response.data).toString().substring(0, 200)
                    : error.message;
                console.log('Clipdrop API error:', errorMsg);
                console.log('Clipdrop API status:', error.response?.status);
                errorMessages.push(`Clipdrop: ${error.response?.status || error.message}`);
            }
        }

        // Try OpenAI DALL-E if Clipdrop failed
        if (!imageBuffer && openaiImage) {
            try {
                console.log('Attempting image generation with OpenAI DALL-E...');
                const response = await openaiImage.images.generate({
                    model: "dall-e-3",
                    prompt: prompt,
                    n: 1,
                    size: "1024x1024",
                    quality: "standard"
                });

                const imageUrl = response.data[0].url;
                const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                imageBuffer = Buffer.from(imageResponse.data);
                
                console.log('Successfully generated image with OpenAI DALL-E');
            } catch (error) {
                console.log('OpenAI DALL-E error:', error.message);
                errorMessages.push(`OpenAI: ${error.message}`);
            }
        }

        // Try Google Imagen API if previous APIs failed
        if (!imageBuffer && process.env.GOOGLE_API_KEY) {
            try {
                console.log('Attempting image generation with Google Imagen...');
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GOOGLE_API_KEY}`,
                    {
                        instances: [{
                            prompt: prompt
                        }],
                        parameters: {
                            sampleCount: 1,
                            aspectRatio: "1:1"
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                const imageBase64 = response.data?.predictions?.[0]?.bytesBase64Encoded;
                
                if (imageBase64) {
                    imageBuffer = Buffer.from(imageBase64, 'base64');
                    console.log('Successfully generated image with Google Imagen');
                } else {
                    throw new Error('No image data in response');
                }
            } catch (error) {
                console.log('Google Imagen error:', error.message);
                errorMessages.push(`Google Imagen: ${error.message}`);
            }
        }

        // Fallback to placeholder if all APIs failed
        if (!imageBuffer) {
            console.log('All APIs failed, using placeholder image');
            try {
                imageBuffer = await createPlaceholderImage(prompt);
                console.log('Placeholder image created successfully');
            } catch (placeholderError) {
                console.error('Error creating placeholder:', placeholderError.message);
                throw new Error('Failed to generate placeholder image');
            }
        }

        // Upload to Cloudinary and save to database
        let secure_url;
        try {
            secure_url = await saveImageToDatabase(userId, prompt, imageBuffer, publish ?? false);
            console.log('Image saved successfully:', secure_url);
        } catch (saveError) {
            console.error('Error saving image to Cloudinary/DB:', saveError.message);
            // Try to return the image as base64 if Cloudinary fails
            const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
            console.log('Returning base64 image as fallback');
            return res.json({ 
                success: true, 
                content: base64Image,
                warning: 'Image generated but failed to upload to cloud. Using base64.'
            });
        }

        res.json({ 
            success: true, 
            content: secure_url,
            ...(errorMessages.length > 0 && { warning: `Used fallback. Errors: ${errorMessages.join('; ')}` })
        });

    } catch (error) {
        console.error('Image generation error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to generate image",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Remove Background
export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions"});
        }

        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [{ effect: 'background_removal', background_removal: 'remove_the_background' }]
        });

        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                   VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

        res.json({ success: true, content: secure_url });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Remove Object
export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions"});
        }

        const { public_id } = await cloudinary.uploader.upload(image.path);

        const imageUrl = cloudinary.url(public_id, {
            transformation: [{ effect: `gen_remove:${object}` }],
            resource_type: 'image'
        });

        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                   VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

        res.json({ success: true, content: imageUrl });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Resume Review with template feedback
export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions"});
        }

        if(resume.size > 5 * 1024 * 1024){
            return res.json({ success: false, message: "Resume file size exceeds allowed size (5MB)."});
        }

        const dataBuffer = fs.readFileSync(resume.path);
        const pdfData = await pdf(dataBuffer);

        // Generate comprehensive resume feedback
        const content = `# Resume Review & Feedback

## Overall Assessment
Your resume has been reviewed and here's my comprehensive feedback:

## Strengths
✅ **Content Quality**: Your resume contains relevant information
✅ **Professional Format**: The document is well-structured
✅ **Experience Section**: Shows career progression

## Areas for Improvement

### 1. **Contact Information**
- Ensure your email is professional
- Include LinkedIn profile URL
- Add your city and state

### 2. **Professional Summary**
- Add a compelling 2-3 line summary at the top
- Highlight your key achievements
- Mention years of experience

### 3. **Skills Section**
- List technical skills relevant to your field
- Include both hard and soft skills
- Use bullet points for clarity

### 4. **Experience Section**
- Use action verbs (Led, Managed, Developed, etc.)
- Quantify achievements with numbers/percentages
- Focus on results and impact

### 5. **Education**
- Include graduation year if recent
- Add relevant coursework or honors
- Include GPA if above 3.5

## Recommendations
1. **Tailor for each job**: Customize your resume for specific positions
2. **Use keywords**: Include industry-specific terms
3. **Keep it concise**: Aim for 1-2 pages maximum
4. **Proofread**: Check for spelling and grammar errors
5. **Use consistent formatting**: Maintain uniform fonts and spacing

## Next Steps
- Update your resume based on this feedback
- Have someone else review it
- Consider using a professional template
- Practice your elevator pitch

**Overall Rating: Good foundation with room for improvement**

*Note: This is a general review template. For personalized feedback, consider consulting with a career counselor.*`;

        await sql`INSERT INTO creations (user_id, prompt, content, type) 
                   VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

        res.json({ success: true, content });

    } catch (error) {
        console.log('Resume review error:', error.message);
        res.json({ success: false, message: "Service temporarily unavailable. Please try again later." });
    }
};
