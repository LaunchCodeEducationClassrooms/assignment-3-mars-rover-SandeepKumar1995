const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  // 7 tests here!
  it("constructor sets position and default values for mode and generatorWatts",function(){
    let testRover = new Rover(100);
    expect(testRover.position).toEqual(100);
    //expect(rover.mode).toEqual('NORMAL');
    expect(testRover.generatorWatts).toEqual(110);
  });

  it("response returned by receiveMessage contains name of message",function(){
    let testMessage = new Message('test message with command',[]);
    let testRover = new Rover(100);
    expect(testRover.receiveMessage(testMessage).message).toEqual(testMessage.name);
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message",function(){
    let testMessage=new Message('test message with command',[new Command('STATUS_CHECK',''),new Command('STATUS_CHECK','')]);
    let testRover=new Rover(100);
    expect(testRover.receiveMessage(testMessage).results.length).toEqual(testMessage.commands.length);
  });

  it("responds correctly to status check command",function(){
    let testMessage=new Message('test message with command',[new Command('STATUS_CHECK','')])
    let testRover= new Rover(100);
    expect(testRover.receiveMessage(testMessage).results).toContain(jasmine.objectContaining({
      roverStatus: {
      mode: testRover.mode,
      generatorWatts: testRover.generatorWatts,
      position: testRover.position
      }
    }))
  });
  
  it("responds correctly to mode change command",function(){
    let testMessage=new Message('test message with command',[new Command('MODE_CHANGE','LOW_POWER')]);
    let testRover=new Rover(100);
    expect(testRover.receiveMessage(testMessage).results[0].completed).toBeTrue();
    expect(testRover.mode).toEqual('LOW_POWER');
  });

  it("responds with false completed value when attempting to move in LOW_POWER mode",function(){
    let testRover=new Rover(100);
    testRover.mode='LOW_POWER';
    let testMessage=new Message('test message with command',[new Command('MOVE',555)]);
    expect(testRover.receiveMessage(testMessage).results[0].completed).toBeFalse();
  });

  it("responds with position for move command",function(){
    let testRover=new Rover(100);
    let testMessage=new Message('test message with command',[new Command('MOVE',555)]);
    testRover.receiveMessage(testMessage);
    console.log(testRover.position);
    expect(testRover.position).toEqual(testMessage.commands[0].value);
  });
});
