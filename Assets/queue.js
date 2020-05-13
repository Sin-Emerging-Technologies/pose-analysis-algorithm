// Queue class 
class Queue 
{ 
    // Array is used to implement a Queue 
    constructor() 
    { 
        this.items = []; 
        this.slidingWindow = 10
    } 
                  
    // Functions to be implemented 
    // enqueue function 
    enqueue(element) 
    {     
        // adding element to the queue 
        this.items.push(element); 
    } 

    movingAverage(number) {
        if (this.items.length === this.slidingWindow) {
            this.items.shift();
        }
        this.items.push(number)
        const movAvg = this.items.reduce((total, num) => total + num, 0) / this.items.length
        return movAvg
    }

    // dequeue() 
    dequeue() 
    { 
        // removing element from the queue 
        // returns underflow when called  
        // on empty queue 
        if(this.isEmpty()) 
            return "Underflow"; 
        return this.items.shift(); 
    } 

    // front function 
    front() 
    { 
        // returns the Front element of 
        // the queue without removing it. 
        if(this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[0]; 
    } 

    // isEmpty function 
    isEmpty() 
    { 
        // return true if the queue is empty. 
        return this.items.length == 0; 
    } 

    // printQueue function 
    printQueue() 
    { 
        var str = ""; 
        for(var i = 0; i < this.items.length; i++) 
            str += this.items[i] +" "; 
        return str; 
    } 

} 