import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

public class CsvToTabConvertor {
    public static void main(String[] args) {
        File file = new File("result123.csv"); 
        List<String> processedLines = new ArrayList<String>();

        try {
            BufferedReader br = new BufferedReader(new FileReader(file)); 
            String line; 
            StringBuilder builder; 
            while((line=br.readLine()) != null) {
                builder = new StringBuilder(line); 

                //find number in double quote - assuming there is only one number with double quotes
                int doubleQuoteIndexStart = builder.indexOf("\""); 
                int doubleQuoteIndexLast = builder.lastIndexOf("\""); 

                //for each line, find all indexes of comma
                int index = builder.indexOf(",");

                //previous used to when there is consecutive comma
                int prevIndex = 0; 

                while (index >= 0) {
                    if(index < doubleQuoteIndexStart || index > doubleQuoteIndexLast) {
                        builder.setCharAt(index, '\t'); 
                    }

                    //get next index of comma
                    index = builder.indexOf(",", index + 1);

                    //check for consecutive commas
                    if(index != -1 && (prevIndex +1) == index) {
                        builder.setCharAt(index, ' ');
                        //get next index of comma
                        index = builder.indexOf(",", index + 1);
                    }
                }

                //add the line to list of lines for later storage to file
                processedLines.add(builder.toString());
            }

            //close the output stream
            br.close(); 

            //write all the lines to the file
            File outFile = new File("csvtotab_processed.csv");
            PrintWriter writer = new PrintWriter(outFile); 
            for(int i = 0; i < processedLines.size(); i++) {
                writer.println(processedLines.get(i));
            }

            writer.close(); 
        } catch(Exception ex) {
            //handle exception
        }
    }
}
