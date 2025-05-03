
//this single class is doing three operations
class BlogPost {
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }

  saveToDatabase() {
    // logic to save to DB
  }

  generateHTML() {
    return `<h1>${this.title}</h1><p>${this.content}</p>`;
  }
}
//---------------------------------------------------------------------------
//now each operation having unique class
class BlogPost {
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }
}

class BlogRepository {
  save(blogPost) {
    // logic to save blogPost to DB
  }
}

class BlogRenderer {
  render(blogPost) {
    return `<h1>${blogPost.title}</h1><p>${blogPost.content}</p>`;
  }
}

