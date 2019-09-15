class InternshipsNotifier {
  constructor(name, bot, db, getInternships) {
    this.name = name;
    this.bot = bot;
    this.db = db;
    this.getInternships = getInternships;
  }

  checkDifference(current, initial) {
    if (initial.length === 0) {
      return [];
    }
  
    const newEntries = [];
    current.forEach(function (internship) {
      if (!initial.includes(internship)) {
        newEntries.push(internship);
      }
    });
  
    return newEntries;
  }

  async notifyUsers(newEntries) {
    const messageContent = this.name + ' ❤\n️\n' + newEntries.join('\n');
    const allUsers = await this.db.getAllUsers();
    for (const user of allUsers) {
      this.bot.sendMessage(user.chat_id, messageContent);
    }
  }

  async start() {
    let initialContent = await this.getInternships();
    console.log('initialContent', initialContent);

    setInterval(() => {
      this.getInternships()
        .then((currentContent) => {
          console.log('currentContent', currentContent);
          currentContent = [...currentContent, 'STEP 2020'];
          
          const newEntries = this.checkDifference(currentContent, initialContent);
          if (newEntries.length > 0) {
            this.notifyUsers(newEntries);
          }

          if (currentContent.length >= initialContent.length) {
            initialContent = [...currentContent]; 
          }
        });
    }, 1000 * 60);
  }
}

module.exports = InternshipsNotifier;