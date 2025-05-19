const readLine = require('readline');
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise((resolve, reject) => {
        rl.question(query, (data) => {
            resolve(data)
        })
    })
}

class Passenger {
    constructor(name, age, gender, berthPreference, allocatedBerth, status) {
        this.id = Math.random().toString(36).substring(2, 6)
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.berthPreference = berthPreference;
        this.allocatedBerth = allocatedBerth;
        this.status = status;
    }
}

class RailwayReservationSystem {
    constructor() {
        //Constants
        this.totalTickets = 0;
        this.totalRACTickets = 2;
        this.totalWaitingTickets = 2;

        //Variables
        this.availableBerths = {
            UB: 0,
            MB: 0,
            LB: 0
        }
        this.childList = [];
        this.bookingList = [];
        this.racList = [];
        this.waitingList = [];
    }

    bookTicket(name, age, gender, berthPreference) {
        if (this.bookingList >= this.totalTickets && this.racList.length >= this.totalRACTickets && this.waitingList.length >= this.totalWaitingTickets) {
            console.log(`All tickets sold out.`)
            return
        }

        const params = { name, age, gender, berthPreference }

        if (this.bookingList.length < this.totalTickets) {
            this.bookNormalTicket(params)
        }
        else if (this.racList.length < this.totalRACTickets) {
            this.bookRacTicket(params)
        }
        else if (this.waitingList.length < this.totalWaitingTickets) {
            this.bookWaitingListTicket(params)
        }
    }

    bookNormalTicket(params) {
        const { name, age, gender, berthPreference } = params

        if (age < 5) {
            const passenger = new Passenger(name, age, gender, berthPreference, null, 'No Ticket (Child)');
            this.childList.push(passenger)
            console.log(`Child age is below 5. No ticket allocated. Details saved.`);
            return
        }

        if ((age >= 60 || gender.toLowerCase() === 'female') && this.availableBerths['LB'] > 0) {
            this.availableBerths['LB']--;
            const passenger = new Passenger(name, age, gender, berthPreference, 'LB', 'Confirmed');
            this.bookingList.push(passenger);
            console.log(`Ticket confirmed for ${name} in LB. Your Booking Id is ${passenger.id}`);
            return;
        }


        // Try preferred berth
        if (this.availableBerths[berthPreference] > 0) {
            this.availableBerths[berthPreference]--;
            const passenger = new Passenger(name, age, gender, berthPreference, berthPreference, 'Confirmed');
            this.bookingList.push(passenger);
            console.log(`Ticket confirmed for ${name} in ${berthPreference}. Your Booking Id is ${passenger.id}`);
            return true;
        }

        // Try any other available berth
        const preferenceOrder = ['LB', 'MB', 'UB']
        for (let berth of preferenceOrder) {
            if (this.availableBerths[berth] > 0) {
                this.availableBerths[berth]--;
                const passenger = new Passenger(name, age, gender, berthPreference, berth, 'Confirmed');
                this.bookingList.push(passenger);
                console.log(`Preferred berth ${berthPreference} not available. Allocated ${berth} to ${name}. Your Booking Id is ${passenger.id}`);
                return true;
            }
        }

        console.log(`No berths available. Ticket Not Booked`)

    }

    bookRacTicket(params) {
        const { name, age, gender, berthPreference } = params
        const passenger = new Passenger(name, age, gender, berthPreference, 'Side LB', 'RAC');
        passenger.status = "RAC";
        passenger.allocatedBerth = "Side LB";
        this.racList.push(passenger);
        return console.log(`Added to RAC: ${name}. Your Booking Id is ${passenger.id}`);
    }

    bookWaitingListTicket(params) {
        const { name, age, gender, berthPreference } = params
        const passenger = new Passenger(name, age, gender, berthPreference, null, 'Waiting');
        passenger.status = "Waiting";
        passenger.allocatedBerth = null;
        this.waitingList.push(passenger);
        return console.log(`Added to Waiting: ${name}. Your Booking Id is ${passenger.id}`);
    }


    cancelTicket(bookingId) {
        var bookedPassenger = this.bookingList.find((ticket) => ticket.id == bookingId)
        if (bookedPassenger) {

            //removed from booking List
            this.availableBerths[bookedPassenger.allocatedBerth]++;
            console.log(`Ticket cancelled for ${bookedPassenger.name}.`);
            this.bookingList = this.bookingList.filter((ticket) => ticket.id != bookingId)


            //promote RAC to booking & Waiting List to RAC
            if (this.racList.length > 0) {
                const toprac = this.racList.shift()
                toprac.allocatedBerth = bookedPassenger.allocatedBerth
                toprac.status = 'Confirmed'
                this.bookingList.push(toprac)
                console.log(`Ticket confirmed for ${toprac.name} in ${toprac.allocatedBerth}. Your Booking Id is ${toprac.id}`);
            }

            //promote Waiting List to RAC
            if (this.waitingList.length > 0) {
                const toprwaiting = this.waitingList.shift()
                toprwaiting.allocatedBerth = null
                toprwaiting.status = 'RAC'
                this.racList.push(toprwaiting)
                console.log(`Added to RAC: ${toprwaiting.name}. Your Booking Id is ${toprwaiting.id}`);
            }
            return
        }

        var racPassenger = this.racList.find((ticket) => ticket.id == bookingId)
        if (racPassenger) {

            //removed from RAC List
            this.racList = this.racList.filter((ticket) => ticket.id != bookingId)
            console.log(`Ticket cancelled for ${racPassenger.name}.`);


            //promote Waiting List to RAC
            if (this.waitingList.length > 0) {
                const topwaiting = this.waitingList.shift()
                topwaiting.allocatedBerth = null
                topwaiting.status = 'RAC'
                this.racList.push(topwaiting)
                console.log(`Added to RAC: ${topwaiting.name}. Your Booking Id is ${topwaiting.id}`);
            }
            return
        }


        var waitingPassenger = this.waitingList.find((ticket) => ticket.id == bookingId)
        if (waitingPassenger) {
            //removed from Waiting List
            this.waitingList = this.waitingList.filter((ticket) => ticket.id != bookingId)
            console.log(`Ticket cancelled for ${waitingPassenger.name}.`);
            return
        }

    }

    printAllBookedTickets() {

        console.log(`Child Tickets:`)
        this.childList.forEach((ticket) => {
            console.log(`Booking Id: ${ticket.id}`)
            console.log(`Name: ${ticket.name}, Age: ${ticket.age}`)
            console.log(`Gender: ${ticket.gender}, Berth Preference: ${ticket.berthPreference}`)
            console.log(`Allocated Berth: ${ticket.allocatedBerth}, Status: ${ticket.status}`)
            console.log(`----------------------------------`)
        })
        console.log(`Booked Tickets:`)
        this.bookingList.forEach((ticket) => {
            console.log(`Booking Id: ${ticket.id}`)
            console.log(`Name: ${ticket.name}, Age: ${ticket.age}`)
            console.log(`Gender: ${ticket.gender}, Berth Preference: ${ticket.berthPreference}`)
            console.log(`Allocated Berth: ${ticket.allocatedBerth}, Status: ${ticket.status}`)
            console.log(`----------------------------------`)
        })
        console.log(`RAC Tickets:`)
        this.racList.forEach((ticket) => {
            console.log(`Booking Id: ${ticket.id}`)
            console.log(`Name: ${ticket.name}, Age: ${ticket.age}`)
            console.log(`Gender: ${ticket.gender}, Berth Preference: ${ticket.berthPreference}`)
            console.log(`Allocated Berth: ${ticket.allocatedBerth}, Status: ${ticket.status}`)
            console.log(`----------------------------------`)
        })
        console.log(`Booked Tickets:`)
        this.waitingList.forEach((ticket) => {
            console.log(`Booking Id: ${ticket.id}`)
            console.log(`Name: ${ticket.name}, Age: ${ticket.age}`)
            console.log(`Gender: ${ticket.gender}, Berth Preference: ${ticket.berthPreference}`)
            console.log(`Allocated Berth: ${ticket.allocatedBerth}, Status: ${ticket.status}`)
            console.log(`----------------------------------`)
        })

    }
}


const reservationSystem = new RailwayReservationSystem();

const handleChoice = async (choice) => {
    switch (choice) {
        case '1':
            const name = await askQuestion('Enter your Name: ')
            const age = await askQuestion('Enter your Age: ')
            const gender = await askQuestion('Enter your Gender: ')
            const berthPreference = await askQuestion('Enter your BerthPreference: ')
            reservationSystem.bookTicket(name, age, gender, berthPreference)
            mainMenu()
            break;
        case `2`:
            const bookingId = await askQuestion('Enter your BookinG ID: ')
            reservationSystem.cancelTicket(bookingId)
            mainMenu()
            break
        case '3':
            reservationSystem.printAllBookedTickets()
            mainMenu()
            break;
        default:
            console.log(`Invalid Choice`)
            mainMenu()
    }
}

const mainMenu = async () => {
    console.log(`
Welcome to Railway Reservation System
1. Book Ticket
2. Cancel Tickets
3. Print All Tickets
`);
    rl.question(`Select an option: `, handleChoice);
}
mainMenu()
