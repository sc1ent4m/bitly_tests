const api_token = "Bearer c6320537ab9f9aa8c8983bbca038107b92b84ec2";
let update_url_data = {
  created_at: "2022-12-08T13:14:20+0000",
  id: "bit.ly/3h7S01w",
  link: "https://bit.ly/3h7S01w",
  custom_bitlinks: ["https://bit.ly/cyan-magenta-yellow-key"],
  long_url: "https://en.wikipedia.org/wiki/CMYK_color_model",
  title: "CMYKZ",
  archived: false,
  created_by: "redbluewhiteblack",
  client_id: "ece654beaf35f9c29f610ffd4fb128702b4bad15",
  tags: [],
  has_override: true,
};

describe("Retrieve Bitlinks by Group", () => {
  it("status 200", () => {
    cy.request({
      method: "GET",
      url: "groups/Bmc7gX1yj4g/bitlinks",
      headers: {
        Authorization: api_token,
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      const respBody = resp.body;
      expect(resp.body.links).to.have.lengthOf(3);
    });
  });
  it("status 403", () => {
    cy.request({
      method: "GET",
      url: "groups/Bmc7gX1yj4/bitlinks",
      headers: {
        Authorization: api_token,
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(403);
      expect(resp.body.message).to.eq("FORBIDDEN");
    });
  });
  it("status 404", () => {
    cy.request({
      method: "GET",
      url: "groups/Bmc7gX1yj4/bitlinkss",
      headers: {
        Authorization: api_token,
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(404);
      // resp have no body, probably bug
    });
  });
});

describe("Update a Bitlink", () => {
  it("status 200", () => {
    let r = (Math.random() + 1).toString(36).substring(7);
    let: update_data = { ...update_url_data };
    let new_title = `CMYK ${r}`;
    update_data.title = new_title;
    cy.request({
      method: "PATCH",
      url: "bitlinks/bit.ly/3h7S01w",
      headers: {
        Authorization: api_token,
      },
      body: update_data,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.title).to.eq(new_title);
    });
    // probably better to check GET link after
  });

  it("status 402 Upgrade Required", () => {
    let: update_data = { ...update_url_data };
    update_data.deeplinks = [];
    cy.request({
      method: "PATCH",
      url: "bitlinks/bit.ly/3h7S01w",
      headers: {
        Authorization: api_token,
      },
      failOnStatusCode: false,
      body: update_data,
    }).then((resp) => {
      expect(resp.status).to.eq(402);
      expect(resp.body.message).to.eq("UPGRADE_REQUIRED");
    });
  });
    it("status 403", () => {
    cy.request({
      method: "PATCH",
      url: "bitlinks/bit.ly/3FebA4k",
      headers: {},
      body: update_url_data,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(403);
      expect(resp.body.message).to.eq("FORBIDDEN");
    });
  });
  it("status 404", () => {
    cy.request({
      method: "PATCH",
      url: "bitlinks/bit.ly/3FebA4k/wrong",
      headers: {},
      body: update_url_data,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(404);
      // no body in response, probably bug
    });
  });
  it("status 410 Gone", () => {
    cy.request({
      method: "PATCH",
      url: "bitlinks/bit.ly/3FebA4k",
      headers: {
        Authorization: api_token,
      },
      body: update_url_data,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(410);

      expect(resp.body.message).to.eq("LINK_IS_DELETED");
    });
  });
  it("status 422 Unprocessable Entity", () => {
    let: update_data = { ...update_url_data };
    update_data.archived = ["wrong parameter"];
    cy.request({
      method: "PATCH",
      url: "bitlinks/bit.ly/3h7S01w",
      headers: {
        Authorization: api_token,
      },
      failOnStatusCode: false,
      body: update_data,
    }).then((resp) => {
      expect(resp.status).to.eq(422);
      expect(resp.body.message).to.eq("UNPROCESSABLE_ENTITY");
    });
  });
});