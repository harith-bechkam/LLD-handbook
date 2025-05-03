//WITH VIOLATION
//If new feature needs to add means developer need to add once more else if condition
import java.util.*;

class shape{
  double calculateshape(String shape,double l,double b,double radius){
   if (shape.equals("circle")) {
        return Math.PI * radius * radius;
    } 
    else if (shape.equals("rectangle")) {
        return l * b;
    }
    return 0;
  }
}



public class main {
    public static void main(String[] args) {
      shape s = new shape();
      System.out.println(s.calculateshape("circle",0,0,5));
  }
}
//---------------------------------------------------------------------------------------------------------------
//WITHOUT VIOLATION
import java.util.*;

interface shape{
  double calculateshape();
}

class circle implements shape{
  private double l,b,radius;
  
  circle(double l,double b,double radius){
    this.l = l;
    this.b = b;
    this.radius = radius;
  }
  
  public double calculateshape(){
    return Math.PI * radius * radius;
  }
  
}

class rectangle implements shape{
  private double l,b,radius;
  
  rectangle(double l,double b,double radius){
    this.l = l;
    this.b = b;
    this.radius = radius;
  }
  
  public double calculateshape(){
    return l * b;
  }
  
}

class startprocess{
  double calculate(shape s){
    return s.calculateshape();
  }
}



public class main {
    public static void main(String[] args) {
      shape cr = new circle(0,0,5);
      shape rect = new circle(0,0,10);
      
      startprocess obj = new startprocess();
      
      System.out.println(obj.calculate(cr));
      System.out.println(obj.calculate(rect));
  }
}

