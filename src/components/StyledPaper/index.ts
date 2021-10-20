import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export default StyledPaper;
