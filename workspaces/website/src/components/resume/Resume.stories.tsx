import { within, userEvent } from '@storybook/testing-library';
import type { Meta, Story } from '@storybook/react';
import Resume from './index';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/web-components/writing-stories/introduction
const meta = {
  title: 'StoryDocker/Resume',
  tags: ['autodocs'],
  component: Resume,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/7.0/web-components/writing-stories/args
export const Primary: Story = {
  args: {
    title: 'Meow McMeowface',
    subtitle: 'I make the best meows',
    website: 'https://meow.com',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = await canvas.getByRole('link', { name: 'meow.com' });
    await expect(loginButton).toBeInTheDocument();
  },
};

// export const Secondary: Story = {
//   args: {
//     label: 'Resume',
//   },
// };

// export const Large: Story = {
//   args: {
//     size: 'large',
//     label: 'Resume',
//   },
// };

// export const Small: Story = {
//   args: {
//     size: 'small',
//     label: 'Resume',
//   },
// };
