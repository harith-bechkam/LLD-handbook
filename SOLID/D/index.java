//WITH VIOLATION
//in here see myapplication is tightly coupled to connect with mongo db only.
//but what i need myapplication class should able to connect to any db.write it in generic way
import java.util.*;


class mongodb{
  public void connect(String uri){
    //connection code
    System.out.println(uri);
  }
}

class myapplication{
  mongodb db = new mongodb();
  
  public void connect(String uri){
    db.connect(uri);
  }
}


public class main {
    public static void main(String[] args) {
       myapplication m = new myapplication();
       m.connect("mongodb://localhost:27017");
  }
}
//-----------------------------------------------------------------------
//WITHOUT VIOLATION
// Loosely coupled: myapplication can work with any db implementation.
// Easy to extend: Want to use MySQL or PostgreSQL? Just implement db.
// Testable: You can mock db in unit tests without needing a real DB.

// High-level module - myapplication
// Abstraction layer - db(interface)
// Low-level module - mongodb

import java.util.*;


interface db{
  void connect();
}

class mongodb implements db{
  
  public String uri;
  
  mongodb(String uri){
    this.uri = uri;
  }
  
  public void connect(){
    //connecction code
    System.out.println(this.uri);
  }
}

class myapplication{
  
  public void start(db d){
    d.connect();
  }
}


public class main {
    public static void main(String[] args) {
       
       db d = new mongodb("mongodb://localhost:27017");
       myapplication m = new myapplication();
       m.start(d);
  }
}


