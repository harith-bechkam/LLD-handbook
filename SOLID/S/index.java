//WITH VIOLATION
//this single class is doing three operations
import java.util.*;

class blogpost{
 String title;
 String content;
 blogpost(String title,String content){
   this.title = title;
   this.content = content;
 }
 
 void saveToDatabase(){
   System.out.println("saveToDatabase");
 }
 
 String generateHTML(){
   return "<html><head><title>" + title + "</title></head><body>" + content + "</body></html>";
 }
}


public class Main {
    public static void main(String[] args) {
      blogpost obj = new blogpost("title","content");
      System.out.println(obj.generateHTML());
  }
}
//---------------------------------------------------------------------------
//WITHOUT VIOLATION
//now each operation having unique class
import java.util.*;

class blogpost {
    private String title;
    private String content;

    public blogpost(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public String getTitle() { return title; }//getter
    public String getContent() { return content; }//getter
}

class blogformatter {
  String generateHTML(){
   return "<html><head><title>" +  "</body></html>";
  }
}

class dbconnection {
  void saveToDatabase(){
   System.out.println("saveToDatabase");
 }
}

public class main {
    public static void main(String[] args) {
      blogpost bp = new blogpost("title","content");
      System.out.println(bp.getTitle()+" - "+bp.getContent());
      
      blogformatter bf = new blogformatter();
      System.out.println(bf.generateHTML());
      
      dbconnection db = new dbconnection();
      db.saveToDatabase();
  }
}
