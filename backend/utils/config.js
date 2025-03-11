const returnPrompt = (promptA) => {
    
    let ans = JSON.parse(promptA)
    
  
    const prompt = `
    YOU ARE A BLOG GENERATOR AGENT. Write a well-structured, professional, and engaging blog post on "${ans.prompt}" under the "${ans.category}" category. Maintain a professional tone throughout the article, similar to the style found on Medium.com.

    Start with a compelling introduction that hooks the reader and provides an overview of the topic. Follow with detailed sections covering key points, supported by examples, data, or expert insights. Use subheadings for clarity and ensure a smooth flow between sections.

    Conclude with a summary of key takeaways and, if applicable, a call to action. Optimize for SEO by naturally incorporating relevant keywords. Ensure readability, originality, and value for the target audience.

    Ensure the article you provide is in markdown code format.
    `

    return prompt; 
}

module.exports = {returnPrompt}