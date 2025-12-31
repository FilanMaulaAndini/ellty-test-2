import React, { useState } from "react";
import "./App.css";
import Button from "./components/ui/button/Button";

function App() {
  const [selectedPages, setSelectedPages] = useState([]);

  const pages = ["Page 1", "Page 2", "Page 3", "Page 4"];

  const handleSelectAll = () => {
    if (selectedPages.length === pages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages([...pages]);
    }
  };

  const handleSelectPage = (page) => {
    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter((p) => p !== page));
    } else {
      setSelectedPages([...selectedPages, page]);
    }
  };

  const handleDone = () => {
    alert(`Selected pages: ${selectedPages.join(", ") || "None"}`);
  };

  return (
    <div className="page-selector-container">
      <div className="page-selector">
        <div className="all-pages-section">
          <div className="page-item">
            <label>
              <span className="page-item-text">All pages</span>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={selectedPages.length === pages.length}
                  onChange={handleSelectAll}
                />
                <div
                  className={`checkmark ${
                    selectedPages.length === pages.length ? "checked" : ""
                  }`}
                >
                  {selectedPages.length === pages.length && (
                    <div className="checkmark-icon" />
                  )}
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="divider" />

        <div className="page-list">
          {pages.map((page) => (
            <div key={page} className="page-item">
              <label>
                <span className="page-item-text">{page}</span>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page)}
                    onChange={() => handleSelectPage(page)}
                  />
                  <div
                    className={`checkmark ${
                      selectedPages.includes(page) ? "checked" : ""
                    }`}
                  >
                    {selectedPages.includes(page) && (
                      <div className="checkmark-icon" />
                    )}
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="divider" />
        <Button label="Done" variant="done-button" onClick={handleDone} />
      </div>
    </div>
  );
}

export default App;
