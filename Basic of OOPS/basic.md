
Concepts:
1. Constructor
2. Keywords: this, super, class, public, static, void, int, if, else, return, new, extends, implements, final, etc.
3. Variables: static, int, String
4. Access Modifiers: private, protected, public
5. Exception Handling: try, catch (Exception e), throw, throws
6. Inheritance & Its Types:
   - Single Inheritance
   - Multilevel Inheritance
   - Hierarchical Inheritance
7. Abstract Class & Methods
8. Interface

 - Java allows only one public class per file, and the filename must match that class.

Basic Code:
```java
import java.util.*;

class Car {
    void run() {
        System.out.println("Car runs");
    }
}

public class Main {
    public static void main(String[] args) {
        Car obj = new Car();
        obj.run();
    }
}
```

Errors:
1. Compile-time Errors: These occur during code writing and are shown in the editor (VS Code).
2. Runtime Errors: These occur when running the program, and the error message is shown in the console.

Constructor:
- A special method used to initialize values to variables. 
- Called when an object of a class is created.

Parameterized Constructor:
```java
import java.util.*;

class Car {
    int no;
    String ssn;
    
    Car(int no, String ssn) {
        this.no = no;
        this.ssn = ssn;
    }
}

public class Main {
    public static void main(String[] args) {
        Car obj = new Car(1, "abc");
        System.out.println(obj.no + " - " + obj.ssn);
    }
}
```

Constructor Overloading:
```java
class Car {
    int no;
    String ssn;

    // Default constructor
    Car() {
        no = 0;
        ssn = "Unknown";
    }

    // Parameterized constructor
    Car(int no, String ssn) {
        this.no = no;
        this.ssn = ssn;
    }

    void display() {
        System.out.println("Car No: " + no + ", SSN: " + ssn);
    }
}

public class Main {
    public static void main(String[] args) {
        // Calling the default constructor
        Car car1 = new Car();
        car1.display();

        // Calling the parameterized constructor
        Car car2 = new Car(101, "ABC123");
        car2.display();
    }
}
```

Super Keyword:
- Used to access methods, variables, and constructors from the parent class.
- Example: 
  - `super.fun();` → Calls the parent class method.
  - `super();` → Calls the parent class constructor.
  - `super(1, "value");` → Calls the parent class parameterized constructor.

This Keyword:
- Refers to the object of the current class.

Access Modifiers:
- `private`: Accessible within the class only.
- `public`: Accessible from anywhere.
- `protected`: Accessible within the same package. Accessible in subclasses (child classes), even if they are in different packages.(once it inherited we can use it)

Inheritance Types:
1. **Single Inheritance**:
   - A subclass inherits from only one superclass.
   ```java
   class Animal {
       void eat() { System.out.println("Eating..."); }
   }

   class Dog extends Animal {
       void bark() { System.out.println("Barking..."); }
   }
   ```

2. **Multilevel Inheritance**:
   - A class is derived from a class, which is also derived from another class.
   ```java
   class Animal {
       void eat() { System.out.println("Eating..."); }
   }

   class Dog extends Animal {
       void bark() { System.out.println("Barking..."); }
   }

   class Puppy extends Dog {
       void weep() { System.out.println("Weeping..."); }
   }
   ```

3. **Hierarchical Inheritance**:
   - Multiple subclasses inherit from a single superclass.
   ```java
   class Animal {
       void eat() { System.out.println("Eating..."); }
   }

   class Dog extends Animal {
       void bark() { System.out.println("Barking..."); }
   }

   class Cat extends Animal {
       void meow() { System.out.println("Meowing..."); }
   }
   ```

**Multiple Inheritance with Classes (Not Allowed in Java)**:
- Java does not support multiple inheritance with classes to avoid ambiguity.
- Example of error:
  ```java
  class B {
      void show() { System.out.println("B"); }
  }

  class C {
      void show() { System.out.println("C"); }
  }

  class A extends B, C { // Compilation error
      public static void main(String[] args) {
          A obj = new A();
          obj.show();
      }
  }
  ```

**Multiple Inheritance with Interfaces (Allowed in Java)**:
- Interfaces can be implemented by a class, allowing multiple inheritance.
  ```java
  interface B {
      void show();
  }

  interface C {
      void display();
  }

  class A implements B, C {
      public void show() {
          System.out.println("B's show");
      }

      public void display() {
          System.out.println("C's display");
      }

      public static void main(String[] args) {
          A obj = new A();
          obj.show();
          obj.display();
      }
  }
  ```

**Abstract Class**:
- An abstract class cannot be instantiated.
- It can have abstract methods (without body) and concrete methods (with body).
- once method is declared as abstract surely it's class should be in abstract class
 - similarity - abstract class & interface -> can't able to instantiated
```java
abstract class Animal {
    abstract void makeSound();  // Abstract method

    void sleep() {              // Concrete method
        System.out.println("Sleeping...");
    }
}

class Dog extends Animal {
    void makeSound() {
        System.out.println("Barking");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.makeSound();  // Output: Barking
        d.sleep();      // Output: Sleeping...
    }
}
```

**Interface**:
 - Helps achieve loose coupling - checkouts LSP(betterly exaplined in there)(Imp point)
 - All methods in an interface are purely public and abstract by default.
 - All variables in an interface are public static final (constants).
 - A class can implement multiple interfaces (supports multiple inheritance).
- interface does not have function explaination.i only need to have function declaration only

In java8+ -> this default,staitic is possible
```java
interface Animal {
    void makeSound();

    default void sleep() {
        System.out.println("Sleeping...");
    }

    static void info() {
        System.out.println("Animal Interface");
    }
}

class Dog implements Animal {
    public void makeSound() {
        System.out.println("Bark!");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.makeSound();   // Output: Bark!
        d.sleep();       // Output: Sleeping...
        Animal.info();   // Output: Animal Interface
    }
}
```

**Real-Time Uses of Interface - In Liskov Substitution Principle**:
1. 1st way:
   ```java
   interface Animal {
       void makeSound();
   }

   class Dog implements Animal {
       public void makeSound() {
           System.out.println("Bark!");
       }
   }

   class Cat implements Animal {
       public void makeSound() {
           System.out.println("Meow!");
       }
   }

   public class Main {
       public static void main(String[] args) {
           Animal a1 = new Dog();
           Animal a2 = new Cat();

           a1.makeSound();  // Output: Bark!
           a2.makeSound();  // Output: Meow!
       }
   }
   ```

2. 2nd way (best way):
   ```java
   interface Processor {
       void process();
   }

   class ImageProcessor implements Processor {
       public void process() {
           System.out.println("Processing image...");
       }
   }

   class VideoProcessor implements Processor {
       public void process() {
           System.out.println("Processing video...");
       }
   }

   class ProcessorRunner {
       public void runProcessor(Processor processor) {
           processor.process();
       }
   }

   public class Main {
       public static void main(String[] args) {
           Processor image = new ImageProcessor();
           Processor video = new VideoProcessor();

           ProcessorRunner runner = new ProcessorRunner();
           runner.runProcessor(image);  // Output: Processing image...
           runner.runProcessor(video);  // Output: Processing video...
       }
   }
   ```

- runProcessor(Processor processor) accepts any object that implements Processor.
 - Helps achieve loose coupling
 - Enables polymorphic behavior
 - This is how Lislov substitiution & Open/Closed Principle


 Quick Rules of Thumb
- Use an interface - "only rules, no code".
     - Whoever uses interface must do this
     - You don’t provide any logic — just the method names (like a contract)

- Use an abstract class - Want to reuse code + give some rules like interface
    ```java
  abstract class Bird {
    void eat() {
        System.out.println("Bird eats");
    }// child class may override this method -> Want to reuse code

    abstract void fly(); // rule: must implement fly() -> like interface
    }
   ```

 - Use a concrete class - when behavior is well-defined and won’t be extended.


