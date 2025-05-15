const readline = require('readline')

class Passenger {
    constructor(name, seats, price) {
        this.name = name
        this.seats = seats
        this.price = price
    }
}

class Flight {
    constructor(name) {
        this.name = name
        this.totalSeats = 50
        this.availableSeats = 50
        this.basePrice = 5000
        this.currentPrice = 5000
        this.passengers = []
    }

    bookTicket(passengerName, seatCount) {
        if (seatCount > this.availableSeats) {
            console.log(`Not enough seats available on this flight - ${this.name}.`)
            return
        }

        const totalPrice = this.currentPrice * seatCount
        const passenger = new Passenger(passengerName, seatCount, totalPrice)
        this.passengers.push(passenger)
        this.availableSeats -= seatCount
        this.currentPrice += 200

        console.log(`Booking successful for ${passengerName} on this flight - ${this.name}`)
        console.log(`Total Price: ₹${totalPrice}`)
    }

    cancelTicket(passengerName) {
        const index = this.passengers.findIndex(p => p.name == passengerName)
        if (index == -1) {
            console.log(`No booking found for ${passengerName} on this Flight - ${this.name}`)
            return
        }

        const passenger = this.passengers[index]
        const refundAmount = passenger.price
        this.passengers.splice(index, 1)
        this.availableSeats += passenger.seats
        this.currentPrice = Math.max(5000, this.currentPrice - 200)

        console.log(`Ticket cancelled for ${passengerName}`)
        console.log(`Refund Amount: ₹${refundAmount}`)
    }

    printDetails() {
        console.log(`Flight: ${this.name}`)
        console.log(`Available Seats: ${this.availableSeats}`)
        console.log(`Current Price: ₹${this.currentPrice}`)
        console.log(`Passengers:`)
        if (this.passengers.length === 0) {
            console.log("No passengers yet.")
        }
        else {
            this.passengers.forEach(p => {
                console.log(`  - ${p.name}, Seats: ${p.seats}`)
            })
        }
        console.log('--------------------------')
    }
}

class FlightBookingSystem {
    constructor() {
        this.flights = new Map()
    }

    addFlight(flightName) {
        if (this.flights.has(flightName)) {
            console.log(`Flight ${flightName} already exists.`)
            return
        }
        this.flights.set(flightName, new Flight(flightName))
        console.log(`New Flight ${flightName} has been added.`)
    }

    book(flightName, passengerName, seatCount) {
        const flight = this.flights.get(flightName)
        if (!flight) {
            console.log(`Flight ${flightName} not found.`)
            return
        }
        flight.bookTicket(passengerName, seatCount)
    }

    cancel(flightName, passengerName) {
        const flight = this.flights.get(flightName)
        if (!flight) {
            console.log(`Flight ${flightName} not found.`)
            return
        }
        flight.cancelTicket(passengerName)
    }

    printFlightDetails(flightName) {
        const flight = this.flights.get(flightName)
        if (!flight) {
            console.log(`Flight ${flightName} not found.`)
            return
        }
        flight.printDetails()
    }

    printAllFlights() {
        this.flights.forEach(flight => flight.printDetails())
    }
}

// Interactive CLI
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function askQuestion(query) {
    return new Promise((resolve, reject) => {
        rl.question(query, resolve)
    })
}

const system = new FlightBookingSystem()


async function handleChoice(choice) {
    switch (choice) {
        case '1':
            var name = await askQuestion("Enter flight name: ")
            system.addFlight(name)
            mainMenu()
            break
        case '2':
            var fname = await askQuestion("Enter flight name: ")
            var pname = await askQuestion("Enter passenger name: ")
            var seats = await askQuestion("Enter number of seats: ")
            system.book(fname, pname, parseInt(seats))
            mainMenu()
            break
        case '3':
            var fname = await askQuestion("Enter flight name: ")
            var fname = await askQuestion("Enter flight name: ")
            system.cancel(fname, pname)
            mainMenu()
            break
        case '4':
            var fname = await askQuestion("Enter flight name to print: ")
            system.printFlightDetails(fname)
            mainMenu()
            break
        case '5':
            system.printAllFlights()
            mainMenu()
            break
        case '6':
            console.log("Exiting...")
            rl.close()
            break
        default:
            console.log("Invalid choice. Try again.")
            mainMenu()
    }
}


async function mainMenu() {
    console.log(`
 -------------------------       
   Flight Booking System
 -------------------------
1. Add Flight
2. Book Ticket
3. Cancel Ticket
4. Print Flight Details
5. Print All Flights
6. Exit
`)
    let choice = await askQuestion("Enter your choice:")
    await handleChoice(choice)
}

mainMenu()
