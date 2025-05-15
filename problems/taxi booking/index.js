const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const LOCATIONS = ["A", "B", "C", "D", "E", "F"]
const DISTANCE_PER_UNIT = 15 // km between adjacent points
const TIME_PER_UNIT = 1 // hours to travel between adjacent points
const BASE_FARE = 100 // for first 5km
const EXTRA_PER_KM = 10
const BASE_KM = 5

class Taxi {
    constructor(id) {
        this.id = id
        this.currentPoint = "A"
        this.freeAt = 0
        this.totalEarnings = 0
        this.trips = []
    }

    assignTrip(customerId, pickup, drop, pickupTime) {
        const distance = Math.abs(LOCATIONS.indexOf(drop) - LOCATIONS.indexOf(pickup)) * DISTANCE_PER_UNIT
        const duration = Math.abs(LOCATIONS.indexOf(drop) - LOCATIONS.indexOf(pickup)) * TIME_PER_UNIT

        let fare = BASE_FARE
        if (distance > BASE_KM) {
            fare += (distance - BASE_KM) * EXTRA_PER_KM
        }

        const dropTime = pickupTime + duration

        this.totalEarnings += fare
        this.currentPoint = drop
        this.freeAt = dropTime

        this.trips.push({
            customerId,
            pickup,
            drop,
            pickupTime,
            dropTime,
            fare,
        })

        return { fare, dropTime }
    }

    isFreeAt(point, time) {
        return this.freeAt <= time
    }
}

class TaxiService {
    constructor(taxiCount = 4) {
        this.taxis = Array.from({ length: taxiCount }, (_, i) => new Taxi(i + 1))
        this.customerId = 1
    }

    findAvailableTaxi(pickupPoint, pickupTime) {
        let candidates = []

        for (let taxi of this.taxis) {
            if (taxi.freeAt <= pickupTime) {
                const taxiLoc = LOCATIONS.indexOf(taxi.currentPoint)
                const pickupLoc = LOCATIONS.indexOf(pickupPoint)
                const distance = Math.abs(taxiLoc - pickupLoc)
                candidates.push({ taxi, distance })
            }
        }

        if (candidates.length === 0) return null

        // Find closest distance
        let minDistance = Math.min(...candidates.map(c => c.distance))
        let filtered = candidates.filter(c => c.distance === minDistance)

        // Choose taxi with lowest earning if tie
        filtered.sort((a, b) => a.taxi.totalEarnings - b.taxi.totalEarnings)
        return filtered[0].taxi
    }

    bookTaxi(pickup, drop, pickupTime) {
        const taxi = this.findAvailableTaxi(pickup, pickupTime)
        if (!taxi) {
            console.log("No taxi available at this time. Booking rejected.\n")
            return
        }

        const result = taxi.assignTrip(this.customerId++, pickup, drop, pickupTime)
        console.log(`✅ Taxi-${taxi.id} booked from ${pickup} to ${drop}. Fare: Rs.${result.fare}. Will reach by hour ${result.dropTime}.\n`)
    }

    printTaxiLogs() {
        for (let taxi of this.taxis) {
            console.log(`Taxi-${taxi.id} | Total Earnings: Rs.${taxi.totalEarnings}`)
            for (let trip of taxi.trips) {
                console.log(
                    `  Customer-${trip.customerId}: ${trip.pickup} to ${trip.drop}, Pickup: ${trip.pickupTime}h, Drop: ${trip.dropTime}h, Fare: Rs.${trip.fare}`
                )
            }
            console.log()
        }
    }
}

const service = new TaxiService(4)

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve))
}


async function askBooking() {
    try {
        let pickup = (await askQuestion("Enter Pickup Point (A-F): ")).toUpperCase()
        if (!LOCATIONS.includes(pickup)) {
            console.log("Invalid pickup location.\n")
            return askBooking()
        }

        let drop = (await askQuestion("Enter Drop Point (A-F): ")).toUpperCase()
        if (!LOCATIONS.includes(drop) || drop === pickup) {
            console.log("Invalid drop location or same as pickup.\n")
            return askBooking()
        }

        let timeStr = await askQuestion("Enter Pickup Time (hour as number, e.g., 9): ")
        let time = parseInt(timeStr)
        if (isNaN(time) || time < 0 || time > 23) {
            console.log("Invalid time.\n")
            return askBooking()
        }

        service.bookTaxi(pickup, drop, time)
        mainMenu()
    }
    catch (error) {
        console.error("Error occurred:", error)
        mainMenu()
    }
}


async function mainMenu() {

    console.log(`
   --------------------------------       
     Welcome to Call Taxi Booking
   --------------------------------
1. Book Taxi
2. Taxi Logs
3. Exit
`)
    let choice = await askQuestion("Enter your choice:")
    if (choice === "1") {
        askBooking()
    }
    else if (choice === "2") {
        service.printTaxiLogs()
        mainMenu()
    }
    else if (choice === "3") {
        rl.close()
    }
    else {
        console.log("Invalid choice.\n")
        mainMenu()
    }
}

mainMenu()
