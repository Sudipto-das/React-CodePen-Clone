import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import { Controlled as ControlledEditor } from "react-codemirror2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompressAlt, faExpandAlt } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

export default function Editor(props) {
  const { language, displayName, value, onChange } = props;
  const [open, setOpen] = useState(true);

  const [currentCode, setCurrentCode] = useState(value);
  const [isClicked, setIsClicked] = useState(false);

  // <-codeversion-control->
  const [codeVersions, setCodeVersions] = useState([]);
  const saveCodeVersion = () => {
    const newVersion = {
      id: uuidv4(), // Generate a unique identifier using a library like `uuid` or a custom implementation
      timestamp: new Date().toLocaleString(), // Store the timestamp when the version is saved
      code: value, // Replace `currentCode` with the variable holding the user's code
    };

    setCodeVersions((prevVersions) => [...prevVersions, newVersion]);
  };
  const handleVersionRevert = (version) => {
    // Update the code with the selected version
    setIsClicked(true);
    setCurrentCode(version.code);
    console.log(currentCode);
  };

  //end

  function handleChange(editor, data, value) {
    onChange(value);
  }

  return (
    <>
      <div className={`editor-container ${open ? "" : "collapsed"}`}>
        <div className="editor-title">
          {displayName}
          <button
            type="button"
            className="expand-collapse-btn"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            <FontAwesomeIcon icon={open ? faCompressAlt : faExpandAlt} />
          </button>
        </div>
        {isClicked ? (
          <ControlledEditor
            onBeforeChange={handleChange}
            value={currentCode}
            className="code-mirror-wrapper"
            options={{
              lineWrapping: true,
              lint: true,
              mode: language,
              theme: "material",
              lineNumbers: true,
            }}
          />
        ) : (
          <ControlledEditor
            onBeforeChange={handleChange}
            value={value}
            className="code-mirror-wrapper"
            options={{
              lineWrapping: true,
              lint: true,
              mode: language,
              theme: "material",
              lineNumbers: true,
            }}
          />
        )}
        <button className="save-btn" onClick={saveCodeVersion}>
          Save Version
        </button>

        {/* Render version history */}
        {codeVersions.map((version) => (
          <div key={version.id}>
            <span id="timestamp">{version.timestamp}</span>
            <button
              className="revert-btn"
              onClick={() => handleVersionRevert(version)}
            >
              Revert
            </button>
          </div>
        ))}
      </div>
      <div>{/* Save version button */}</div>
    </>
  );
}
