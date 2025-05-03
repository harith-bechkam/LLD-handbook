//WITH VIOLATION
//since penguin is child class
//when fly method is defined inside penguin it should print something.but here it throw error 

// Another explanation
// penguin is a subclass of bird, but calling fly() on it breaks the expected behavior.
// If the base class promises a fly() method, all subclasses should support it without throwing errors.
import java.util.*;

class bird{
  void fly(){
    System.out.println("bird flys");
  }
}

class sparrow extends bird{
  @Override
  void fly(){
    System.out.println("sparrow flys");
  }
}

class penguin extends bird{
  @Override
  void fly(){
    throw new UnsupportedOperationException("Penguin can't fly");
  }
}

public class main {
    public static void main(String[] args) {
      
      bird obj1 = new sparrow();
      bird obj2 = new penguin();
      obj1.fly();
      obj2.fly();
  }
}
//---------------------------------------------------------------------------------
//WITHOUT VIOLATION
// All birds can eat, so eat() is in the base class bird.
// Not all birds can fly, so flying is separated into an interface flyableBirds. - loosely coupled


// Sparrow is a bird and can fly, so it extends bird and implements flyableBirds.
// Penguin is a bird but cannot fly, so it only extends bird.

import java.util.*;


class bird{
  public void eat(){
    System.out.println("Bird eats");
  }
}

interface flyableBirds{
  void fly();
}

class sparrow extends bird implements flyableBirds{

  public void eat(){
    System.out.println("sparrow eats");
  }
  
  public void fly(){
    System.out.println("sparrow flys");
  }
}

class penguin extends bird{
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
