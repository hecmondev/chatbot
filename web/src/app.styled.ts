import {
  Avatar,
  AvatarProps,
  IconButton,
  IconButtonProps,
  styled,
} from '@mui/material';
import { ElementType } from 'react';

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'width' && prop !== 'height',
})<AvatarProps & { width: string; height: string }>(({ width, height }) => ({
  width: `${width}rem`,
  height: `${height}rem`,
}));

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) =>
    prop !== 'width' && prop !== 'height' && prop !== 'variant',
})<
  IconButtonProps & {
    component: ElementType;
    width: string;
    height: string;
    variant: string;
  }
>(({ theme, width, height, variant }) => ({
  width: `${width}rem`,
  height: `${height}rem`,
  backgroundColor: theme.palette.background.paper,
  boxSizing: 'border-box',
  border: `.063rem dashed ${theme.palette.background.default}`,
  cursor: 'pointer',
  borderRadius: variant === 'circular' ? '3.125rem' : 0,
  '&:hover': {
    backgroundColor: theme.palette.common.white,
  },
}));

export { StyledAvatar, StyledIconButton };
