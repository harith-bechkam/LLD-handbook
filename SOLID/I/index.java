//WITH VIOLATION

// Violates ISP: Robot is forced to implement eat() even though it doesn't need it.
interface Worker {
    void work();
    void eat();
}
class Human implements Worker {
    public void work() {
        System.out.println("Robot working...");
    }

    public void eat() {
        System.out.println("Humans eating...");
    }
}
class Robot implements Worker {
    public void work() {
        System.out.println("Robot working...");
    }

    public void eat() {
        throw new UnsupportedOperationException("Robots do not eat!");
    }
}

public class ISPViolation {
    public static void main(String[] args) {
        Human human = new Human();
        human.work();
        human.eat();
        Robot robot = new Robot();
        robot.work();
        robot.eat(); // Causes error
    }
}
//WITHOUT VIOLATION
//we can also use class for worker. since worker is both human and robot
// but eat - should be in interface only.Because eat can only be possible by human only not robot

interface worker {
    void work();
}

interface Eatable {
    void eat();
}

class Human implements worker, Eatable {
    public void work() {
        System.out.println("Developer is coding...");
    }

    public void eat() {
        System.out.println("Developer is eating...");
    }
}

class Robot implements worker {
    public void work() {
        System.out.println("Robot is working...");
    }
}

public class ISPExample {
    public static void main(String[] args) {
        Human human = new Human();
        human.work();
        human.eat();

        Robot robot = new Robot();
        robot.work();
    }
}

//ex2:

interface bird{
  void eat();
}

interface flyableBirds{
  void fly();
}

class sparrow implements bird,flyableBirds{

  public void eat(){
    System.out.println("sparrow eats");
  }
  
  public void fly(){
    System.out.println("sparrow flys");
  }
}

class penguin implements bird{
  public void eat(){
    System.out.println("Penguin eats");
  }
}

public class main {
    public static void main(String[] args) {
      bird sb = new sparrow();
      bird pb = new penguin();
      sb.eat();
      pb.eat();
      
      flyableBirds sf = new sparrow();
      sf.fly();
  }
}