import {
  Container,
  Skeleton,
} from '@mui/material';
import AppBar from './AppBar';

export default function LoadingSkeleton() {
  return (
    <>
      <AppBar />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={300} />
      </Container>
    </>
  );
}
