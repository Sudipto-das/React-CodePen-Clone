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

  const [codeVersions, setCodeVersions] = useState([]);

  const saveCodeVersion = () => {
    const newVersion = {
      id: uuidv4(),
      timestamp: new Date().toLocaleString(),
      code: value,
    };

    setCodeVersions((prevVersions) => [...prevVersions, newVersion]);
  };

  const handleVersionRevert = (version) => {
    setIsClicked(true);
    setCurrentCode(version.code); // Update the currentCode with the selected version's code
  };

  function handleChange(editor, data, value) {
    setCurrentCode(value); // Update the currentCode when the user makes changes
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
        <ControlledEditor
          onBeforeChange={handleChange}
          value={isClicked ? currentCode : value} // Use the updated currentCode if revert button is clicked
          className="code-mirror-wrapper"
          options={{
            lineWrapping: true,
            lint: true,
            mode: language,
            theme: "material",
            lineNumbers: true,
          }}
        />

        <button className="save-btn" onClick={saveCodeVersion}>
          Save Version
        </button>

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
