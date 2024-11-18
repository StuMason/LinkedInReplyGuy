class DOMUtils {
    static async setCommentReply(article, comment) {
      const commentButton = article.querySelector(".comment-button");
      if (!commentButton) throw new Error("Comment button not found");
  
      commentButton.click();
      
      await this.waitForElement(article, ".ql-editor p");
      const editor = article.querySelector(".ql-editor p");
      editor.textContent = comment;
    }
  
    static waitForElement(parent, selector, timeout = 5000) {
      return new Promise((resolve, reject) => {
        const element = parent.querySelector(selector);
        if (element) return resolve(element);
  
        const observer = new MutationObserver((mutations, obs) => {
          const element = parent.querySelector(selector);
          if (element) {
            obs.disconnect();
            resolve(element);
          }
        });
  
        observer.observe(parent, {
          childList: true,
          subtree: true
        });
  
        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
      });
    }
  }