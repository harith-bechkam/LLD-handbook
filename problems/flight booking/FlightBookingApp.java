import java.util.*;

class Passenger {
    String name;
    int seats;
    double price;

    public Passenger(String name, int seats, double price) {
        this.name = name;
        this.seats = seats;
        this.price = price;
    }
}

class Flight {
    String name;
    int totalSeats = 50;
    int availableSeats = 50;
    double basePrice = 5000;
    double currentPrice = 5000;
    List<Passenger> passengers = new ArrayList<>();

    public Flight(String name) {
        this.name = name;
    }

    public void bookTicket(String passengerName, int seatCount) {
        if (seatCount > availableSeats) {
            System.out.println("Not enough seats available on this flight - " + name + ".");
            return;
        }

        double totalPrice = currentPrice * seatCount;
        Passenger passenger = new Passenger(passengerName, seatCount, totalPrice);
        passengers.add(passenger);
        availableSeats -= seatCount;
        currentPrice += 200;

        System.out.println("Booking successful for " + passengerName + " on this flight - " + name);
        System.out.println("Total Price: ₹" + totalPrice);
    }

    public void cancelTicket(String passengerName) {
        Passenger found = null;

        for (Passenger p : passengers) {
            if (p.name.equals(passengerName)) {
                found = p;
                break;
            }
        }

        if (found == null) {
            System.out.println("No booking found for " + passengerName + " on this flight - " + name);
            return;
        }

        passengers.remove(found);
        availableSeats += found.seats;
        currentPrice = Math.max(5000, currentPrice - 200);

        System.out.println("Ticket cancelled for " + passengerName);
        System.out.println("Refund Amount: ₹" + found.price);
    }

    public void printDetails() {
        System.out.println("Flight: " + name);
        System.out.println("Available Seats: " + availableSeats);
        System.out.println("Current Price: ₹" + currentPrice);
        System.out.println("Passengers:");
        if (passengers.isEmpty()) {
            System.out.println("No passengers yet.");
        } else {
            for (Passenger p : passengers) {
                System.out.println("  - " + p.name + ", Seats: " + p.seats);
            }
        }
        System.out.println("--------------------------");
    }
}

class FlightBookingSystem {
    Map<String, Flight> flights = new HashMap<>();

    public void addFlight(String flightName) {
        if (flights.containsKey(flightName)) {
            System.out.println("Flight " + flightName + " already exists.");
            return;
        }
        flights.put(flightName, new Flight(flightName));
        System.out.println("New Flight " + flightName + " has been added.");
    }

    public void book(String flightName, String passengerName, int seatCount) {
        Flight flight = flights.get(flightName);
        if (flight == null) {
            System.out.println("Flight " + flightName + " not found.");
            return;
        }
        flight.bookTicket(passengerName, seatCount);
    }

    public void cancel(String flightName, String passengerName) {
        Flight flight = flights.get(flightName);
        if (flight == null) {
            System.out.println("Flight " + flightName + " not found.");
            return;
        }
        flight.cancelTicket(passengerName);
    }

    public void printFlightDetails(String flightName) {
        Flight flight = flights.get(flightName);
        if (flight == null) {
            System.out.println("Flight " + flightName + " not found.");
            return;
        }
        flight.printDetails();
    }

    public void printAllFlights() {
        for (Flight flight : flights.values()) {
            flight.printDetails();
        }
    }
}

public class FlightBookingApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        FlightBookingSystem system = new FlightBookingSystem();
        boolean running = true;

        while (running) {
            System.out.println("\n🚀 Flight Booking System");
            System.out.println("1. Add Flight");
            System.out.println("2. Book Ticket");
            System.out.println("3. Cancel Ticket");
            System.out.println("4. Print Flight Details");
            System.out.println("5. Print All Flights");
            System.out.println("6. Exit");
            System.out.print("Enter your choice: ");

            String choice = scanner.nextLine();

            switch (choice) {
                case "1":
                    System.out.print("Enter flight name: ");
                    String fname = scanner.nextLine();
                    system.addFlight(fname);
                    break;
                case "2":
                    System.out.print("Enter flight name: ");
                    String bookFname = scanner.nextLine();
                    System.out.print("Enter passenger name: ");
                    String pname = scanner.nextLine();
                    System.out.print("Enter number of seats: ");
                    int seats = Integer.parseInt(scanner.nextLine());
                    system.book(bookFname, pname, seats);
                    break;
                case "3":
                    System.out.print("Enter flight name: ");
                    String cancelFname = scanner.nextLine();
                    System.out.print("Enter passenger name: ");
                    String cancelPname = scanner.nextLine();
                    system.cancel(cancelFname, cancelPname);
                    break;
                case "4":
                    System.out.print("Enter flight name to print: ");
                    String printFname = scanner.nextLine();
                    system.printFlightDetails(printFname);
                    break;
                case "5":
                    system.printAllFlights();
                    break;
                case "6":
                    System.out.println("👋 Exiting...");
                    running = false;
                    break;
                default:
                    System.out.println("❌ Invalid choice. Try again.");
            }
        }

        scanner.close();
    }
}
