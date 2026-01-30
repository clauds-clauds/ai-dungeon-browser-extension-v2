class LEQuery {
  environment(): "production" | "beta" | "alpha" {
    const env = window.location.hostname.split(".")[0];
    return env === "play" ? "production" : env === "beta" ? "beta" : "alpha";
  }

  authToken(): string | null {
    try {
      const rawState = localStorage.getItem(`auth_state_${this.environment()}`);
      if (!rawState) return null;
      const state = JSON.parse(rawState);
      // I do not think it is wise to log whatever happens to auth tokens.
      // debug.success(true, "Successfully grabbed the auth token!");
      return state.accessToken;
    } catch (e) {
      debug.error(false, "Oops! Something went wrong while getting the auth token:", e);
      return null;
    }
  }

  adventureId(): string {
    const match = window.location.pathname.match(/adventure\/([^\/]+)/);
    return match ? match[1] : "";
  }

  async adventureData() {
    try {
      const token = this.authToken();
      const shortId = this.adventureId();

      if (!token || !shortId) {
        debug.error(false, "No auth token or adventure ID found! Cannot proceed.");
        return;
      }

      const response = await fetch("https://api.aidungeon.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operationName: "GetAdventure",
          variables: { shortId },
          query: `
          query GetAdventure($shortId: String) {
            adventure(shortId: $shortId) {
              id
              shortId
              title
              description
              memory
              authorsNote
              storyCards {
                id
                type
                keys
                value
                title
                description
              }
            }
          }
        `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.adventure;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  exitButton(): HTMLElement | null {
    return document.querySelector('div[role="button"][aria-label="Exit game"]');
  }

  settingsButton(): HTMLElement | null {
    return document.querySelector('button[role="button"][aria-label="Settings"][tabindex="0"]');
  }

  rewardsButton(): HTMLElement | null {
    return document.querySelector('div[role="button"][aria-label="Daily Rewards"][tabindex="0"]');
  }

  notificationsButton(): HTMLElement | null {
    return document.querySelector('div[role="button"][aria-label="Notifications"][tabindex="0"]');
  }

  gameplayOutput(): HTMLElement | null {
    return document.querySelector('#gameplay-output[aria-label="Story"]');
  }

  lastAction(parent: HTMLElement): HTMLElement | null {
    return parent.querySelector('span[aria-label^="Last action:"]');
  }
}

export const query = new LEQuery();
