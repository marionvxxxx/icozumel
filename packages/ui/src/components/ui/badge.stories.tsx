import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline', 'verified', 'tier1', 'tier2', 'locked'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Verified: Story = {
  args: {
    variant: 'verified',
    children: '✓ Verified',
  },
};

export const Tier1: Story = {
  args: {
    variant: 'tier1',
    children: 'Tier 1',
  },
};

export const Tier2: Story = {
  args: {
    variant: 'tier2',
    children: 'Tier 2',
  },
};

export const Locked: Story = {
  args: {
    variant: 'locked',
    children: '🔒 Locked',
  },
};

export const BusinessCategories: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">Restaurant</Badge>
      <Badge variant="verified">✓ Verified Business</Badge>
      <Badge variant="tier1">Basic Tier</Badge>
      <Badge variant="tier2">Premium Tier</Badge>
      <Badge variant="locked">🔒 Feature Locked</Badge>
    </div>
  ),
};