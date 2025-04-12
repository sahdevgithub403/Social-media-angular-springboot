export class CommentPayload {
    text: string;
    postId: number;
    username?: string;
    duration?: string;
  
    constructor(text: string, postId: number, username: string, duration: string) {
      this.text = text;
      this.postId = postId;
      this.username = username;
      this.duration = duration;
    }
  }
  