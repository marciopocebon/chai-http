import chai from 'chai';
import chaiHttp from '..';
chai.use(chaiHttp);

describe('assertions', () => {
  it('#status property "status"', () => {
    const res = { status: 200 };
    res.should.to.have.status(200);

    (function () {
      res.should.not.have.status(200);
    }).should.throw('expected { status: 200 } to not have status code 200');

    (function () {
      ({}).should.not.to.have.status(200);
    }).should.throw('expected {} to have keys \'status\', or \'statusCode\'');
  });

  it('#status property "statusCode"', () => {
    const res = { statusCode: 200 };
    res.should.to.have.status(200);
  });

  it('#ip', () => {
    '127.0.0.1'.should.be.an.ip;
    '2001:0db8:85a3:0000:0000:8a2e:0370:7334'.should.be.an.ip;

    (function () {
      '127.0.0.1'.should.not.be.an.ip;
    }).should.throw('expected \'127.0.0.1\' to not be an ip');

    (function () {
      '2001:0db8:85a3:0000:0000:8a2e:0370:7334'.should.not.be.an.ip;
    }).should.throw('expected \'2001:0db8:85a3:0000:0000:8a2e:0370:7334\' to not be an ip');
  });

  it('#header test existence', () => {
    const req = { headers: { foo: 'bar' } };
    const res = {
      getHeader(key) {
        return key === 'foo' ? 'bar' : undefined;
      },
    };

    req.should.have.header('foo');
    req.should.not.have.header('bar');

    res.should.have.header('foo');
    res.should.not.have.header('bar');

    (function () {
      req.should.have.header('bar');
    }).should.throw('expected header \'bar\' to exist');

    (function () {
      res.should.have.header('bar');
    }).should.throw('expected header \'bar\' to exist');
  });

  it('#header test value', () => {
    const req = { headers: { foo: 'bar' } };
    const res = {
      getHeader() {
        return 'foo';
      },
    };

    req.should.have.header('foo', 'bar');
    res.should.have.header('bar', 'foo');
    res.should.have.header('bar', /^fo/);

    (function () {
      req.should.not.have.header('foo', 'bar');
    }, 'expected header \'foo\' to not have value bar');

    (function () {
      res.should.not.have.header('bar', 'foo');
    }).should.throw('expected header \'bar\' to not have value foo');

    (function () {
      res.should.not.have.header('bar', /^fo/);
    }).should.throw('expected header \'bar\' not to match /^fo/ but got \'foo\'');
  });

  it('#header case insensitive', () => {
    const req = { headers: { foo: 'bar' } };
    const res = {
      getHeader() {
        return 'foo';
      },
    };

    res.should.have.header('Foo');
    res.should.have.header('Bar');
    req.should.have.header('FoO', 'bar');
    res.should.have.header('BAr', 'foo');
  });

  it('#headers', () => {
    const req = { headers: { foo: 'bar' } };
    const res = {
      getHeader() {
        return 'foo';
      },
    };

    req.should.have.headers;
    res.should.have.headers;

    (function () {
      req.should.not.have.headers;
    }).should.throw('expected { headers: { foo: \'bar\' } } to not have headers or getHeader method');

    (function () {
      res.should.not.have.headers;
    }).should.throw(/expected .*getHeader.* to not have headers or getHeader method/);
  });

  it('#json', () => {
    const req = { headers: { 'content-type': [ 'application/json' ] } };
    const res = {
      getHeader() {
        return 'application/json';
      },
    };

    req.should.be.json;
    res.should.be.json;

    (function () {
      req.should.not.be.json;
    }).should.throw('expected [ \'application/json\' ] to not include \'application/json\'');

    (function () {
      res.should.not.be.json;
    }).should.throw('expected \'application/json\' to not include \'application/json\'');
  });

  it('#text', () => {
    const req = { headers: { 'content-type': [ 'text/plain' ] } };
    const res = {
      getHeader() {
        return 'text/plain';
      },
    };

    req.should.be.text;
    res.should.be.text;

    (function () {
      req.should.not.be.text;
    }).should.throw('expected [ \'text/plain\' ] to not include \'text/plain\'');

    (function () {
      res.should.not.be.text;
    }).should.throw('expected \'text/plain\' to not include \'text/plain\'');
  });

  it('#html', () => {
    const req = { headers: { 'content-type': [ 'text/html' ] } };
    const res = {
      getHeader() {
        return 'text/html';
      },
    };

    req.should.be.html;
    res.should.be.html;

    (function () {
      req.should.not.be.html;
    }).should.throw('expected [ \'text/html\' ] to not include \'text/html\'');

    (function () {
      res.should.not.be.html;
    }).should.throw('expected \'text/html\' to not include \'text/html\'');
  });

  it('#redirect', () => {
    const res = { status: 200 };
    res.should.not.redirect;

    [ 301, 302, 303, 307, 308 ].forEach((status) => {
      ({ status }).should.redirect;
    });

    ({
      status: 200,
      redirects: [ 'http://example.com' ],
    }).should.redirect;

    ({
      status: 200,
      redirects: [],
    }).should.not.redirect;

    (function () {
      ({ status: 200 }).should.redirect;
    }).should.throw('expected redirect with 30X status code but got 200');

    (function () {
      ({ status: 301 }).should.not.redirect;
    }).should.throw('expected not to redirect but got 301 status');
  });

  it('#redirectTo', () => {
    let res = { status: 301, headers: { location: 'foo' } };
    res.should.redirectTo('foo');

    res = { status: 301, headers: { location: 'bar' } };
    res.should.not.redirectTo('foo');

    res = { status: 200, redirects: [ 'bar' ] };
    res.should.redirectTo('bar');

    res = { status: 200, redirects: [ 'bar' ] };
    res.should.not.redirectTo('foo');

    (function () {
      ({ status: 301, headers: { location: 'foo' } }).should.not.redirectTo('foo');
    }).should.throw('expected header \'location\' to not have value foo');

    (function () {
      ({ status: 301, headers: { location: 'bar' } }).should.redirectTo('foo');
    }).should.throw('expected header \'location\' to have value foo');

    (function () {
      ({ status: 200, redirects: [ 'bar', 'baz' ] }).should.redirectTo('foo');
    }).should.throw('expected redirect to foo but got bar then baz');
  });

  it('#param', () => {
    const req = { url: '/test?x=y&foo=bar' };
    req.should.have.param('x');
    req.should.have.param('foo');
    req.should.have.param('x', 'y');
    req.should.have.param('foo', 'bar');
    req.should.not.have.param('bar');
    req.should.not.have.param('y');
    req.should.not.have.param('x', 'z');
    req.should.not.have.param('foo', 'baz');

    (function () {
      req.should.not.have.param('foo');
    }).should.throw(/expected .* to not have property 'foo'/);

    (function () {
      req.should.not.have.param('foo', 'bar');
    }).should.throw(/expected .* to not have property 'foo' of 'bar'/);
  });

  it('#param (nested)', () => {
    const req = { url: '/test?form[name]=jim&form[lastName]=bob' };
    req.should.have.param('form');
    req.should.have.nested.param('form.name');
    req.should.have.nested.param('form.name', 'jim');
    req.should.have.nested.param('form.lastName');
    req.should.have.nested.param('form.lastName', 'bob');
    req.should.not.have.param('bar');
    req.should.not.have.nested.param('form.bar');
    req.should.not.have.nested.param('form.name', 'sue');

    (function () {
      req.should.not.have.nested.param('form.name');
    }).should.throw(/expected .* to not have nested property 'form.name'/);

    (function () {
      req.should.not.have.nested.param('form.lastName', 'bob');
    }).should.throw(/expected .* to not have nested property 'form.lastName' of 'bob'/);
  });

  it('#cookie', () => {
    const res = {
      headers: {
        'set-cookie': [ 'name=value', 'name2=value2; Expires=Wed, 09 Jun 2021 10:18:14 GMT' ],
      },
    };
    res.should.have.cookie('name');
    res.should.have.cookie('name2');
    res.should.have.cookie('name', 'value');
    res.should.have.cookie('name2', 'value2');
    res.should.not.have.cookie('bar');
    res.should.not.have.cookie('name2', 'bar');

    (function () {
      res.should.not.have.cookie('name');
    }).should.throw('expected cookie \'name\' to not exist');

    (function () {
      res.should.have.cookie('foo');
    }).should.throw('expected cookie \'foo\' to exist');

    (function () {
      res.should.not.have.cookie('name', 'value');
    }).should.throw('expected cookie \'name\' to not have value \'value\'');

    (function () {
      res.should.have.cookie('name2', 'value');
    }).should.throw('expected cookie \'name2\' to have value \'value\' but got \'value2\'');
  });

  it('#cookie (request)', () => {
    const cookie = [
      'name=value;',
      'name2=value2; Expires=Wed, 09 Jun 2021 10:18:14 GMT',
      'name3=value3; Domain=.somedomain.com',
    ];
    const req = {
      headers: {
        'set-cookie': cookie,
      },
    };
    req.should.have.cookie('name');
    req.should.have.cookie('name2');
    req.should.have.cookie('name3');
    req.should.have.cookie('name', 'value');
    req.should.have.cookie('name2', 'value2');
    req.should.have.cookie('name3', 'value3');
    req.should.not.have.cookie('bar');
    req.should.not.have.cookie('name2', 'bar');

    (function () {
      req.should.not.have.cookie('name');
    }).should.throw('expected cookie \'name\' to not exist');

    (function () {
      req.should.have.cookie('foo');
    }).should.throw('expected cookie \'foo\' to exist');

    (function () {
      req.should.not.have.cookie('name', 'value');
    }).should.throw('expected cookie \'name\' to not have value \'value\'');

    (function () {
      req.should.have.cookie('name2', 'value');
    }).should.throw('expected cookie \'name2\' to have value \'value\' but got \'value2\'');
  });

  it('#cookie (agent)', () => {
    const agent = chai.request.agent();
    const cookies = [
      'name=value',
      'name2=value2; Expires=Wed, 09 Jun 2021 10:18:14 GMT',
      'name3=value3; Domain=.somedomain.com',
    ];
    // Using superagent.Agent (node)
    if (agent.jar) {
      agent.jar.setCookies(cookies);

    // using superagent.Request (browser)
    } else {
      agent.set('set-cookie', cookies);
    }

    agent.should.have.cookie('name');
    agent.should.have.cookie('name2');
    agent.should.have.cookie('name3');
    agent.should.have.cookie('name', 'value');
    agent.should.have.cookie('name2', 'value2');
    agent.should.have.cookie('name3', 'value3');
    agent.should.not.have.cookie('bar');
    agent.should.not.have.cookie('name2', 'bar');

    (function () {
      agent.should.not.have.cookie('name');
    }).should.throw('expected cookie \'name\' to not exist');

    (function () {
      agent.should.have.cookie('foo');
    }).should.throw('expected cookie \'foo\' to exist');

    (function () {
      agent.should.not.have.cookie('name', 'value');
    }).should.throw('expected cookie \'name\' to not have value \'value\'');

    (function () {
      agent.should.have.cookie('name2', 'value');
    }).should.throw('expected cookie \'name2\' to have value \'value\' but got \'value2\'');
  });
});
