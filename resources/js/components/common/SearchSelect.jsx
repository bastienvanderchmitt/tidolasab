import React, { useMemo, useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import Field from "../formik/Field";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormikContext } from "formik";

const HighlightText = ({ text, highlighted }) => {
  return text
    .split(new RegExp(`(${highlighted})`, "gi"))
    .map((part, index) => (
      <React.Fragment key={index}>
        {part.toLowerCase() === highlighted.toLowerCase() ? (
          <span className="text-primary">{part}</span>
        ) : (
          part
        )}
      </React.Fragment>
    ));
};

const SearchSelect = ({ array, valueName, callback }) => {
  const { values, setFieldValue } = useFormikContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filtrer les items en fonction du terme de recherche
  const filteredArray = array?.filter((item) =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedTerm = useMemo(
    () =>
      !!values[valueName]
        ? array?.find((item) => +item.id === +values[valueName])?.text
        : null,
    [values, array, valueName],
  );

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (item) => {
    setSearchTerm("");
    setSelectedIndex(selectedIndex);
    setFieldValue(valueName, item.id);
    callback && callback(item.id);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, filteredArray.length - 1),
      );
    } else if (event.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      event.preventDefault();
      event.stopPropagation();
      handleSelect(filteredArray[selectedIndex]);
    }
  };

  return (
    <>
      <InputGroup>
        <Input
          type="text"
          value={
            searchTerm !== "" ? searchTerm : selectedTerm ? selectedTerm : ""
          }
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher..."
          aria-label="Rechercher"
        />
        <Button
          onClick={() => {
            if (selectedTerm) {
              setSearchTerm("");
              setFieldValue(valueName, null);
            }
          }}
          aria-label="Réinitialiser la recherche"
        >
          {selectedTerm ? (
            <FontAwesomeIcon icon={faTimes} className="me-1" />
          ) : (
            <FontAwesomeIcon icon={faSearch} className="me-1" />
          )}
        </Button>
      </InputGroup>
      <Field type="select" name="booking" className="d-none" />
      {!!searchTerm && (
        <ListGroup style={{ position: "absolute" }}>
          <SimpleBar style={{ maxHeight: "200px", zIndex: "999" }}>
            {filteredArray.length > 0 ? (
              filteredArray.map((item, index) => (
                <ListGroupItem
                  key={index}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      index === selectedIndex || index === selectedIndex
                        ? "#f0f0f0"
                        : "white",
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onMouseLeave={() => setSelectedIndex(-1)}
                  onClick={() => handleSelect(item)}
                >
                  <HighlightText text={item.text} highlighted={searchTerm} />
                </ListGroupItem>
              ))
            ) : (
              <ListGroupItem disabled>Aucun item trouvé</ListGroupItem>
            )}
          </SimpleBar>
        </ListGroup>
      )}
    </>
  );
};

export default SearchSelect;
