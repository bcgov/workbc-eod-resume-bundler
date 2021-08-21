import { TextField } from '@material-ui/core';
import { TablePagination } from '@material-ui/core';
import React, { useState } from 'react';

const SearchBar = ({handleUpdate, paginationCount}) => {
    const [searchBar, setSearchBar] = useState("");
  
    const handleSearchBarChange = (event) => {
      let searchString = event?.target?.value;
      handleUpdate(searchString);
      setSearchBar(searchString);
    };
  
    return (
    <React.Fragment>
      <div className="column">
        <b>Find jobs</b>
        <div className="row justify-content-between">
          <form>
            <TextField 
              value={searchBar}
              onChange={handleSearchBarChange}
              size="small" 
              id="outlined-basic" 
              variant="outlined" 
              placeholder="..." />
            </form>
          <TablePagination
            component="div"
            count={paginationCount}
            page={0}
            onPageChange={() => console.log("page change!")}
            rowsPerPage={20}
            rowsPerPageOptions={[]}
          />
        </div>
      </div>
    </React.Fragment>
    );
  }

  export default SearchBar;