import { ImageList, ImageListItem } from '@mui/material';

interface PhotoGridProps {
  photos: { id: string; path: string }[];
}

const PhotoGrid = ({ photos }: PhotoGridProps) => (
  <ImageList variant='masonry' cols={3} gap={8}>
    {photos.map((photo) => (
      <ImageListItem key={photo.id}>
        <img
          src={photo.path}
          alt=''
          style={{
            width: '100%',
            borderRadius: '12px',
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
      </ImageListItem>
    ))}
  </ImageList>
);

export default PhotoGrid;
