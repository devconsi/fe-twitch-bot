import React from "react";

function decrease() {
  var i = 0;
  var width = 100;

  if (i == 0) {
    i = 1;
    var elem = document.getElementById("bar");
    width = 100;
    var id = setInterval(frame, 1000);
    function frame() {
      if (width == 0) {
        clearInterval(id);
        i = 0;
      } else {
        width -= 0.25;
        elem.style.width = width + "%";
      }
    }
  }
}

const Button = (props) => {
  return (
    <div>
      <input
        type="button"
        value="Reset"
        onClick={() => props.setWidth(100)} 
      />
    </div>
  );
};

const ProgressBar = (props) => {
    

  return (
    <div class="progressBar">
      <InternalBar width={props.width} setWidth={props.setWidth}></InternalBar>
    </div>
  );
};

const InternalBar = (props) => {
  return <div onClick={() => props.setWidth(props.width-10)} style={{width: props.width + '%'}} class="bar"></div>;
};


function Bar( { width, setWidth}) {
    
    
  return (
    /* Load Bar */
    <div>
      <ProgressBar width={width} setWidth={setWidth} />
      <Button width={width} setWidth={setWidth} />
    </div>
  );
}

export default Bar;