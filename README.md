This is a programm to implement multiple timers on the page.

Styles are a bare minimum for different parts of the current page where this code is implemented and can be changed into any suitable styles;

Attributes to use and their meaning: 

- data-timer="true" - nessesery attribute, to make piece of code considered by the programm
- data-postfix="value" - can be avoided in string-timers. Sets the posfix, that will show programm where to print the output
- data-deadline="YYYY-MM-DD hh:mm" - can be avoided in the markup, if set from the settings by the programm. Sets the deadline
- data-period="d" - can be avoided in the markup, if set from the settings by the programm. Sets the period of renewal in days
  
Classes to use and their meaning: 
- js-value - if you want to set the attributes from the settings object. Value is a key in the settings
- string-timer - if you want timer like this "00 d | 00 h | 00 m"

In example.html given different types of murkup for different sections of the website;