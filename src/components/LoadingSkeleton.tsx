import {
  Container,
  Skeleton,
} from '@mui/material';

export default function LoadingSkeleton() {
  return (
    <>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={300} />
      </Container>
    </>
  );
}
