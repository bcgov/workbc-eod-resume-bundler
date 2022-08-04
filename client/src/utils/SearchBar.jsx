import { TablePagination, TextField } from "@material-ui/core"
import React, { useState } from "react"

const SearchBar = ({ handleUpdate, paginationCount, label }) => {
    const [searchBar, setSearchBar] = useState("")

    const handleSearchBarChange = (event) => {
        const searchString = event?.target?.value

        if (searchString !== searchBar) {
            handleUpdate(searchString)
            setSearchBar(searchString)
        }
    }

    const handleKeyPress = (event) => {
        if (event.keyCode === 13) {
            // enter key code
            event.preventDefault()
        }
    }

    return (
        <div className="column">
            <div className="row">
                <b>{label}</b>
            </div>
            <div className="row justify-content-between">
                <form>
                    <TextField
                        value={searchBar}
                        onChange={handleSearchBarChange}
                        onKeyDown={handleKeyPress}
                        size="small"
                        id="outlined-basic"
                        variant="outlined"
                        placeholder="..."
                    />
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
    )
}

export default SearchBar
