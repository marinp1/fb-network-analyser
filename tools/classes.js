module.exports = {
  FriendNode: class {
    constructor(id) {
      this.id = id;
      this.name = '';
      this.friends = [];
    }

    setName(name) {
      this.name = name;
    }

    addFriend(friendId) {
      this.friends.push(friendId);
    }

    addFriends(friendIdList) {
      this.friends = this.friends.concat(friendIdList);
    }
  }
}