import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

interface Props {
  onSearch: (search: string) => void;
}

const FilterProduct: React.FC<Props> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    // Clear any existing timeout before starting a new one
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Create a new timeout to trigger search after 500ms
    const newTimeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    // Update timeoutId state for cleanup
    setTimeoutId(newTimeoutId);
  };

  const handleClear = () => {

    setSearchTerm('');
    onSearch('');
  };

  // Cleanup function to clear any remaining timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <TextField
      id="filterby-product-name"
      fullWidth
      InputProps={{
        style: {
          borderRadius: 50
        },
        endAdornment: (
          <InputAdornment position="end" onClick={handleClear}>
            <IconButton style={{ padding: '3px' }}>
              {searchTerm.length ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      variant="outlined"
      placeholder="Filter by product name"
      value={searchTerm}
      onChange={handleSearchChange}
    />
  );
};
export default FilterProduct;
