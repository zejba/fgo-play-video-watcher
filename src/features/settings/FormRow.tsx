import { styled } from '@mui/material';

export const FormRow = styled('div')(({ theme }) => ({
  display: 'flex',
  columnGap: 12,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  [theme.breakpoints.down('md')]: {
    border: `1px solid #ccc`,
    borderRadius: 8,
    padding: 16,
    paddingBottom: 0,
    marginBottom: 16
  },
  [theme.breakpoints.up('md')]: {
    flexWrap: 'nowrap'
  }
}));
