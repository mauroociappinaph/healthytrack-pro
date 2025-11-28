import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    localStorage.clear();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should handle logout', () => {
    // Setup initial state
    useAuthStore.setState({
      user: { id: '1', email: 'test@test.com', name: 'Test' },
      token: 'fake-token',
      isAuthenticated: true
    });

    const stateBefore = useAuthStore.getState();
    expect(stateBefore.isAuthenticated).toBe(true);

    // Act
    stateBefore.logout();

    // Assert
    const stateAfter = useAuthStore.getState();
    expect(stateAfter.user).toBeNull();
    expect(stateAfter.token).toBeNull();
    expect(stateAfter.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
