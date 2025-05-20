const readLine = require('readline');
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise((resolve) => {
        rl.question(query, (data) => resolve(data));
    });
};

class Mail {
    constructor(id, sender, receiver, subject, content, tags = []) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.subject = subject;
        this.content = content;
        this.tags = tags;
    }

    isSpam(spamWords) {
        for (const word of spamWords) {
            if (this.subject.includes(word) || this.content.includes(word)) {
                return true;
            }
        }
        return false;
    }
}

class MailSystem {
    constructor() {
        this.mails = [];
        this.nextId = 1;
        this.spamWords = ['offer', 'free', 'win', 'money'];
    }

    storeMail(sender, receiver, subject, content) {
        const mail = new Mail(this.nextId++, sender, receiver, subject, content);
        if (mail.isSpam(this.spamWords)) {
            mail.tags.push('spam');
        }
        this.mails.push(mail);
        console.log('Mail stored successfully.');
    }

    deleteMail(id) {
        const index = this.mails.findIndex(mail => mail.id == id);
        if (index !== -1) {
            this.mails.splice(index, 1);
            console.log('Mail deleted.');
        } else {
            console.log('Mail not found.');
        }
    }

    addTag(id, tag) {
        const mail = this.mails.find(mail => mail.id == id);
        if (mail) {
            if (!mail.tags.includes(tag)) {
                mail.tags.push(tag);
            }
            console.log('Tag added.');
        } else {
            console.log('Mail not found.');
        }
    }

    showStats(n) {
        console.log(`Total mails: ${this.mails.length}`);

        const tagGroups = {};
        this.mails.forEach(mail => {
            mail.tags.forEach(tag => {
                if (!tagGroups[tag]) tagGroups[tag] = 0;
                tagGroups[tag]++;
            });
        });

        console.log('Tag groups:', tagGroups);

        console.log(`Recent ${n} mails:`);
        this.mails.slice(-n).forEach(mail => {
            console.log(`ID: ${mail.id}, Subject: ${mail.subject}`);
        });
    }

    searchMails(query) {
        const result = this.mails.filter(mail =>
            mail.subject.includes(query) ||
            mail.content.includes(query) ||
            mail.sender.includes(query) ||
            mail.receiver.includes(query)
        );
        console.log(`Found ${result.length} mails:`);
        result.forEach(mail => console.log(`ID: ${mail.id}, Subject: ${mail.subject}`));
    }

    wildcardSearch(pattern) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        const result = this.mails.filter(mail =>
            regex.test(mail.subject) || regex.test(mail.content)
        );
        console.log(`Wildcard Search found ${result.length} mails:`);
        result.forEach(mail => console.log(`ID: ${mail.id}, Subject: ${mail.subject}`));
    }
}

const mailSystem = new MailSystem();

async function main() {
    while (true) {
        console.log(`\n1. Store Mail\n2. Delete Mail\n3. Add Tag\n4. Show Stats\n5. Search\n6. Wildcard Search\n7. Exit`);
        const choice = await askQuestion('Choose an option: ');

        switch (choice) {
            case '1':
                const sender = await askQuestion('Sender: ');
                const receiver = await askQuestion('Receiver: ');
                const subject = await askQuestion('Subject: ');
                const content = await askQuestion('Content: ');
                mailSystem.storeMail(sender, receiver, subject, content);
                break;

            case '2':
                const deleteId = await askQuestion('Enter Mail ID to delete: ');
                mailSystem.deleteMail(parseInt(deleteId));
                break;

            case '3':
                const tagId = await askQuestion('Enter Mail ID to tag: ');
                const tag = await askQuestion('Enter Tag: ');
                mailSystem.addTag(parseInt(tagId), tag);
                break;

            case '4':
                const n = await askQuestion('Enter number of recent mails to show: ');
                mailSystem.showStats(parseInt(n));
                break;

            case '5':
                const query = await askQuestion('Enter search query: ');
                mailSystem.searchMails(query);
                break;

            case '6':
                const pattern = await askQuestion('Enter wildcard pattern (use *): ');
                mailSystem.wildcardSearch(pattern);
                break;

            case '7':
                rl.close();
                return;

            default:
                console.log('Invalid option.');
        }
    }
}

main();
